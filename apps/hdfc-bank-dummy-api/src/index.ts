import express from "express";
import { hdfcBankDummyApiSchema, hdfcNetBankingSchema } from "@repo/zod-types/zod-types";
import db from "@repo/db/client";
import cors from "cors"

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
                    token: token
                }
            }),

        ]);

        res.status(200).json({
            url: "http://localhost:3004/net-banking",
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

    if(!parsedBody.success){
        return res.status(400).json({
            message: "Invalid Inputs"
        });
    }

    try{

    } catch(error){
        
    }
})

app.listen(3004, () => {
    console.log("Bank sever is running on port: 3004");
});