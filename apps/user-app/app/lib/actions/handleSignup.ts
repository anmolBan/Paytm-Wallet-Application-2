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
        return { success: false, error: parsedData.error.flatten() };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try{
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },      // condition 1: find by email
                    { phone: phone } // condition 2: find by username (for example)
                ]
            }
        });
        if(user){
            return { success: false, error: "Email or phone already exists." };
        }
        await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword
            }
        });
        return { success: true, message: "User created successfully." };
    } catch(error: any){
        console.error("Server error:", error);
        return {
            success: false,
            error: error.message || "An unexpected error occurred.",
          };
    }
}