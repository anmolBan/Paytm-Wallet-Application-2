import express from "express";
import db from "@repo/db/client";
import 'dotenv/config'; 
import { hdfcBankWebhookSchema } from "@repo/zod-types/zod-types";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello World, this is the HDFC Webhook Server."
    });
});

app.post("/hdfcwebhook", async (req, res) => {

    const body = req.body;
    const parsedBody = hdfcBankWebhookSchema.safeParse(body);

    if(!parsedBody.success){
        console.log("Failed in bank-webhook's zod validation.");
        return res.status(400).json({
            message: "Invalid inputs."
        });
    }

    const paymentInformation: {
        token: string;
        userId: number;
        amount: number;
        secret: string;
    } = {
        token: req.body.token,
        userId: req.body.userId,
        amount: req.body.amount,
        secret: req.body.secret
    };

    try{
        const transaction = await db.onRampTransaction.findFirst({
            where: {
                token: paymentInformation.token
            }
        });

        if(!transaction){
            console.log("Failed in bank-webhook. Our database isn't up.")
            return res.status(500).json({
                message: "Database isn't up."
            });
        }

        if(transaction?.status === "Failure" || transaction?.status === "Success"){
            // console.log("Bhaiyya chutiya samjhe ho kya?");
            console.log("Someone is trying to re-attempt the already completed transaction.")
            return res.status(403).json({
                message: "Invalid request OR Request already completed."
            });
        }
    } catch(error){
        console.error(error);
        return res.status(500).json({
            message: "Internal server error."
        });
    }

    const ourSecret = (process.env.HDFC_SECRET);
    if(ourSecret !== paymentInformation.secret){
        try {
            await db.onRampTransaction.update({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Failure"
                }
            });
        } catch (updateError) {
            console.error("Error updating transaction status to Failure:", updateError);
        }
        return res.status(401).json({
            message: "You aren't authorized."
        });
    }

    try{
        await db.$transaction([
            db.balance.upsert({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                update: {
                    amount: {
                        increment: Number(paymentInformation.amount)
                    }
                },
                create: {
                    // Create a new balance entry if it doesn't exist
                    userId: Number(paymentInformation.userId),
                    amount: Number(paymentInformation.amount),
                    locked: 0
                }
            }),
            db.onRampTransaction.update({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Success"
                }
            })
        ]);

        res.status(200).json({
            message: "Captured"
        });
    } catch(error){
        console.error(error);

        try {
            await db.onRampTransaction.update({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Failure"
                }
            });
        } catch (updateError) {
            console.error("Error updating transaction status to Failure:", updateError);
        }

        res.status(411).json({
            message: "Error while processing webhook"
        });
    }
});

app.listen(3005, () =>{
    console.log("Bank web-hook server is running.");
});
