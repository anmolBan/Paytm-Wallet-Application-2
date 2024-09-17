"use client"
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { Select } from "@repo/ui/select"
import { Button } from "@repo/ui/button";
import { createOnRampTransaction } from "../app/lib/actions/createOnRampTxn";
import axios from "axios";
import { useSession } from "next-auth/react";
import { authOptions } from "../app/lib/auth";
import { useRouter } from "next/navigation";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "http://localhost:3004/getbankapi"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com"
}];

export const AddMoney = () => {
    const [ redirectUrl, setRedirectUrl ] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [ amount, setAmount ] = useState(0);
    const [ provider, setProvider ] = useState(SUPPORTED_BANKS[0]?.name);
    const session = useSession();
    const router = useRouter();
    
    return (
        <div className="w-full">
            <TextInput label={"Amount"} placeholder={"Amount"} onChange={(value) => {
                setAmount(parseInt(value))
            }}/>
            <div className="py-4 text-left">
                Bank
            </div>
            <Select onSelect={(value) => {
                setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "");
                setProvider(SUPPORTED_BANKS.find(x => x.name === value)?.name);
            }} options={SUPPORTED_BANKS.map(x => ({
                key: x.name,
                value: x.name
            }))} />
            <div className="flex justify-center pt-4">
                <Button onClick={async () => {
                    if(amount*100 > 0){
                        // window.location.href = redirectUrl || "";
                        if(redirectUrl){
                            const res = await axios.post(redirectUrl, {
                                userId: session.data?.user.id,
                                amount: amount * 100
                            });
                            if(res.status === 200){
                                await createOnRampTransaction(amount * 100, provider || "", res.data.token);
                                const res2 = await axios.post(res.data.url, {
                                    token: "0.40850367208266647",//res.data.token,
                                    amount: amount * 100,
                                });
                            }
                            router.refresh();
                        }
                    }
                    else{
                        alert("Amount should be greater than zero.");
                    }
                }}>
                Add Money
                </Button>
            </div>
        </div>
    )
}