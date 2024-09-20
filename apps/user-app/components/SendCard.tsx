"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { handleP2PTransaction } from "../app/lib/actions/handleP2PTxn";
import { useRouter } from "next/navigation";

export function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState(0);
    const router = useRouter();
    return <div>
        <Center>
            <Card title="Send">
                <div className="min-w-72 pt-2">
                    <TextInput placeholder={"Number"} label="Number" onChange={(value) => {
                        setNumber(value);
                    }} />
                    <TextInput placeholder={"Amount"} label="Amount" onChange={(value) => {
                        setAmount(parseInt(value));
                    }} />
                    <div className="pt-4 flex justify-center">
                        <Button onClick={async () => {
                            await handleP2PTransaction(number, amount * 100);
                            router.refresh();
                        }}>Send</Button>
                    </div>
                </div>
            </Card>
        </Center>
    </div>
}