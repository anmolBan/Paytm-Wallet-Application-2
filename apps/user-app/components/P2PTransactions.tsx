"use server"
import { Card } from "@repo/ui/card"
import { getServerSession } from "next-auth";
import { authOptions } from "../app/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@repo/db/client";

export const P2PTansactions = async ({ transactions }: {
    transactions: {
        amount: number,
        from: number,
        to: number,
        time: Date,
        status: string,
        phone: string
    }[]
}) => {
    if(!transactions.length){
        console.log(transactions.length);
        return <Card title="Recent Transactions">
            <div>
                No Recent Transactions
            </div>
        </Card>
    }

    const session = await getServerSession(authOptions);
    // const session = useSession();
    if(!session){
        redirect("api/auth/signin");
    }

    return (
        <Card title="Recent Transactions">
            <div className="pt-2">
                {transactions.map(t => <div className="flex justify-between">
                    <div>
                        <div className="text-sm">
                            {t.from === parseInt(session.user.id) ? <div>Sent to- {t.phone} ({t.status}) </div> : <div>Recieved from- {t.phone} ({t.status})</div>}
                        </div>
                        <div className="text-slate-600 text-xs">
                            {t.time.toDateString()}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        {t.from === parseInt(session.user.id) ? <div> - Rs {t.amount / 100}</div> : <div> + Rs {t.amount / 100}</div>}
                    </div>
                </div>)}
            </div>
        </Card>
    )
}

async function getRecieverDetails(recieverId: number){
    try{
        const reciever = prisma.user.findUnique({
            where: {
                id: Number(recieverId)
            },
            select: {
                name: true,
                phone: true
            }
        });
        return reciever;
    } catch(error){
        console.error(error);
        return {}
    }
}