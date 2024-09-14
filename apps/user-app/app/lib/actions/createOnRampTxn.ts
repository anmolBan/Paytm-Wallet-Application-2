"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { redirect } from 'next/navigation'; // Adjust based on your Next.js version
import prisma from "@repo/db/client";

export async function createOnRampTransaction(amount: number, provider: string) {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
        // Redirect to the login page
        redirect('/api/auth/signin'); // Adjust this path to your login page
    }
    
    const userId = parseInt(session.user.id);
    const token = Math.random().toString();
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

    alert("Transaction created");
    return;
}
