"use server"
import prisma from "@repo/db/client";
import { handleSignupSchema } from "@repo/zod-types/zod-types";
import bcrypt from "bcrypt";

export async function handleSignup({name, email, phone, password} : {
    name: string;
    email: string;
    phone: string;
    password: string;
}){
    const parsedData = handleSignupSchema.safeParse({name, email, phone, password});

    if(!parsedData.success){
        return new Error("Invalid inputs.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try{
        await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword
            }
        });
    } catch(error){
        console.error(error);
        return error;
    }
}