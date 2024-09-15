import express from "express";
import db from "@repo/db/client"

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    console.log("You are in HDFC Webhook Sever");
    res.status(200).json({
        message: "Hello World, this is the HDFC Webhook Server."
    });
});

app.post("/hdfcwebhook", async (req, res) => {
    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };

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

app.listen(3003);
