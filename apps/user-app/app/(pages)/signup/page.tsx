"use client"
import { Button } from "@repo/ui/button";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react"

export default async function(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <h1>Sign up</h1>
                    <h2>Enter your information to create an account</h2>
                    <TextInput placeholder={"John Doe"} label={"Name"} onChange={(value: string) => {
                        (setName(value))
                    }}></TextInput>
                    <TextInput placeholder={"xyz@example.com"} label={"Email"}
                    onChange={(value) => setEmail(value)}></TextInput>
                    <TextInput placeholder={"1231231231"} label={"Phone"} onChange={(value) => setPhone(value)}></TextInput>
                    <TextInput placeholder={"Password"} label={"Password"} onChange={(value) => setPassword(value)} type="password"></TextInput>
                    <div className="pt-4">
                        <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Sign up</button>
                    </div>
                    {/* <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"}></BottomWarning> */}
                </div>
            </div>
        </div>
    )
} 