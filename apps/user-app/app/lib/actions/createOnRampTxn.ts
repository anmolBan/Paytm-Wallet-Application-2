"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { redirect } from 'next/navigation'; // Adjust based on your Next.js version
import prisma from "@repo/db/client";
import { createOnRampTransactionSchema } from "@repo/zod-types/zod-types";

export async function createOnRampTransaction(amount: number, provider: string, token: string) {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
        // Redirect to the login page
        redirect('/api/auth/signin'); 
    }

    const parsedData = createOnRampTransactionSchema.safeParse({
        amount,
        provider,
        token
    });

    if(!parsedData.success){
        throw new Error("Invalid inputs.");
    }
    
    const userId = parseInt(session.user.id);
    try{
        await prisma.onRampTransaction.create({
            data: {
                userId,
                amount: amount,
                status: "Processing",
                startTime: new Date(),
                provider,
                token: token
            }
        });
        return {
            message: "On ramp transaction added"
        }
    } catch(error){
        console.error(error);
        throw new Error("There is an error");
    }
}
