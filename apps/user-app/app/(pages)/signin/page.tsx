"use client"
import { useState } from "react"
import { TextInput } from "@repo/ui/textinput";
import { BottomWarning } from "../../../components/BottomWarning";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function(){
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();
    
    async function onClickHandler(){
        setError("");

        const res = await signIn("credentials", {
            phone,
            password,
            redirect: false
        });

        if(res?.error){
            setError(res.error);
        } else{
            router.push("/dashboard");
        }
    }
    return (
        <div className="bg-slate-300 h-screen flex flex-col justify-center items-center">
            {error && (
                <div className="bg-red-500 w-80 py-7 text-white rounded-lg text-center overflow-auto px-2">
                    <div>
                        {error}
                    </div>
                </div>
            )}
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <h1 className="text-4xl font-bold mb-1">Sign in</h1>
                    <h2 className="text-base">Enter your credentials to access your account</h2>
                    <TextInput onChange={(value) => setPhone(value)} label={"Phone"} placeholder={"1234567890"}/>
                    <TextInput onChange={(value) => setPassword(value)} label={"Password"} placeholder={"Password"} type={"password"}/>
                    <div className="pt-4">
                        <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2" onClick={onClickHandler} >Sign in</button>
                    </div>
                    <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"}/>
                </div>
            </div>
        </div>
    )
} 