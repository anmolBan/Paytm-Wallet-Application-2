"use client"
import { Button } from "@repo/ui/button";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react"
import { handleSignup } from "../../lib/actions/handleSignup";
import { useRouter } from "next/navigation";
import { BottomWarning } from "../../../components/BottomWarning";

export default function(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleOnClickSignup = async () => {
        setError("");

        const res : any = await handleSignup({name, email, phone, password});

        if(res.success){
            router.push("/api/auth/signin");
        }
        else{
            setError(res.error);
            console.error(res.error);
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
                    <h1 className="text-4xl font-bold mb-1">Sign up</h1>
                    <h2 className="text-base">Enter your information to create an account</h2>
                    <TextInput placeholder={"John Doe"} label={"Name"} onChange={(value) => {
                        (setName(value))
                    }}></TextInput>
                    <TextInput placeholder={"xyz@example.com"} label={"Email"}
                    onChange={(value) => setEmail(value)}></TextInput>
                    <TextInput placeholder={"1231231231"} label={"Phone"} onChange={(value) => setPhone(value)}></TextInput>
                    <label className="block text-sm font-medium text-gray-900 text-left mt-2">Password</label>
                    <input onChange={(value) => {setPassword(value.target.value)}} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Password" type="password"/>
                    <div className="pt-4">
                        <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2" onClick={handleOnClickSignup}>Sign up</button>
                    </div>
                    <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/api/auth/signin"}></BottomWarning>
                </div>
            </div>
        </div>
    )
} 