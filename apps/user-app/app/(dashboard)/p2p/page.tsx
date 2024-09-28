"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import { SendCard } from "../../../components/SendCard";
import prisma from "@repo/db/client";
import { P2PTansactions } from "../../../components/P2PTransactions";

export default async function(){
    const session = await getServerSession(authOptions);
    
    if(!session?.user){
        redirect("/api/auth/signin");
    }

    const transactions = await getP2PTransactions();

    return (
        <div className="w-screen h-screen">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
                Transfer
            </div>
            <div className="flex justify-center gap-10 h-5/6 w-full">
                <div className="flex flex-col w-1/2 justify-center">
                    <SendCard/>
                </div>
                <div className="flex flex-col w-1/2 justify-center mr-28">
                    <div>
                        <P2PTansactions transactions={transactions} />
                    </div>
                </div>
            </div>
        </div>
    )
    
}

async function getP2PTransactions(){
    const session = await getServerSession(authOptions);
    try{
        const p2pTransactions = await prisma.p2pTransfer.findMany({
            where: {
                OR: [
                    { fromUserId: Number(session?.user.id) },  // Condition 1: Sent by the user
                    { toUserId: Number(session?.user.id) }     // Condition 2: Received by the user
                ]
            }
        });

        console.log(p2pTransactions.length);

        // const p2pTransactionsRecieved = await prisma.p2pTransfer.findMany({
        //     where: {
        //         toUserId: Number(session?.user.id)
        //     }
        // });

        const allTransactions =  p2pTransactions.map( (t) => ({
            amount: t.amount,
            from: t.fromUserId,
            to: t.toUserId,
            time: t.timestamp,
            status: t.status,
            phone: t.toPhone
        }));

        return allTransactions;

    } catch(error){
        console.error(error);
        return [];
    }
}