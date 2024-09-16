import express from "express";
import db from "@repo/db/client";
import 'dotenv/config'; 

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello World, this is the HDFC Webhook Server."
    });
});

app.post("/hdfcwebhook", async (req, res) => {
    const paymentInformation: {
        token: string;
        userId: number;
        amount: string;
        secret: string;
    } = {
        token: req.body.token,
        userId: req.body.userId,
        amount: req.body.amount,
        secret: req.body.secret
    };

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
        res.status(411).json({
            message: "Error while processing webhook"
        });
    }
});

app.listen(3005, () =>{
    console.log("Bank web-hook server is running.");
});
