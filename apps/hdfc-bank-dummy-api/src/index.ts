import express from "express";
import { hdfcBankDummyApiSchema, hdfcNetBankingSchema } from "@repo/zod-types/zod-types";
import db from "@repo/db/client";
import cors from "cors"
import axios from "axios";
import 'dotenv/config'; 

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello World! This is the dummy bank api."
    });
});

app.post("/getbankapi", async (req, res) => {
    const body = req.body;
    const parsedBody = hdfcBankDummyApiSchema.safeParse(body);
    const token = Math.random().toString();

    if(!parsedBody.success){
        return res.status(400).json({
            message: "Invalid Input"
        });
    }

    try{
        await db.$transaction([
            db.hDFCBank.create({
                data: {
                    userId: Number(req.body.userId),
                    amount: Number(req.body.amount),
                    token: token,
                    status: "Processing"
                }
            }),

        ]);
        res.status(200).json({
            url: `${process.env.HDFC_URL}/net-banking`,
            token: token
        });
    } catch(error){
        console.error(error);
        res.status(500).json({
            message: "Internal server error."
        });
    }

});

app.post("/net-banking", async (req, res) => {
    const body = req.body;
    const parsedBody = hdfcNetBankingSchema.safeParse(body);

    if (!parsedBody.success) {
        return res.status(400).json({
            message: "Invalid Inputs"
        });
    }

    try {
        const transaction = await db.hDFCBank.findFirst({
            where: {
                token: body.token
            }
        });

        if (!transaction) {
            console.log("No transactions");
            return res.status(401).json({
                message: "Invalid transaction"
            });
        }

        const secret = process.env.SECRET;
        // Handle the axios call and error properly
        const url = process.env.WEBHOOK_URL || 'localhost'
        try {
            await axios.post(`${url}/hdfcwebhook`, {
                userId: transaction.userId,
                secret: secret,
                token: body.token,
                amount: body.amount
            });

            // Update the transaction status to success if the axios request succeeds
            await db.$transaction(async (prisma) => {
                await prisma.hDFCBank.update({
                    where: {
                        id: transaction.id
                    },
                    data: {
                        status: "Success"
                    }
                });
            });

            return res.status(200).json({
                message: "Success"
            });

        } catch (error) {
            // Log the axios error and respond with a failure message
            console.error("Axios request failed:", error);
            // Optionally, you can update the transaction status to "Failed" here
            await db.hDFCBank.update({
                where: {
                    id: transaction.id
                },
                data: {
                    status: "Failure"
                }
            });
            return res.status(500).json({
                message: "Transaction failed due to external API error"
            });
        }

    } catch (error) {
        console.error("Internal server error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

app.listen(3004, () => {
    console.log("Bank sever is running on port: 3004");
});