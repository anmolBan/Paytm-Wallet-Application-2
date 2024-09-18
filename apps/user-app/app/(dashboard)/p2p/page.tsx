import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import { SendCard } from "../../../components/SendCard";

export default async function(){
    const session = await getServerSession(authOptions);
    
    if(!session?.user){
        redirect("/api/auth/signin");
    }
    return (
        <div className="w-full">
            <SendCard/>
        </div>
    )
}