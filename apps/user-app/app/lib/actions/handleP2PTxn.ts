"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import { redirect } from "next/navigation";
import prisma from "@repo/db/client";

export async function handleP2PTransaction(recipientNumber: string, amount: number){
    const session = await getServerSession(authOptions);

    if(!session || !session.user){
        redirect("/api/auth/signin");
    }

    const senderId = parseInt(session.user.id);

    try{
        const reciever = await prisma.user.findFirst({
            where: {
                phone: recipientNumber
            }
        });

        if(!reciever){
            return {
                message: "User not found"
            }
        }

        await prisma.$transaction(async(tx) => {
            const senderBalance = await tx.balance.findUnique({
                where: {
                    userId: Number(senderId)
                }
            });

            if(!senderBalance){
                throw new Error("Internal server error");
            }

            if(senderBalance.amount < amount){
                throw new Error("Insufficient funds");
            }

            await tx.balance.update({
                where: {
                    userId: Number(senderId)
                },
                data: {
                    amount: {
                        decrement: amount
                    }
                }
            });

            await tx.balance.update({
                where: {
                    userId: Number(reciever.id)
                },
                data: {
                    amount: {
                        increment: amount
                    }
                }
            });
        });
    } catch(error){
        console.error(error);
        return{
            error
        }
    }
}