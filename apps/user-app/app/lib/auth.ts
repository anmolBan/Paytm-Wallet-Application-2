import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import { userSigninSchema } from "@repo/zod-types/zod-types";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

interface CredentialsType{
    phone: string;
    password: string
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                phone: { label: "Phone number", type: "text", placeholder: "1231231231", required: true },
                password: { label: "Password", type: "password", required: true }
            },
            async authorize(credentials: CredentialsType | undefined) {

                if(!credentials){
                    return null;
                }
                
                const loginCredentials = {
                    phone: credentials.phone,
                    password: credentials.password
                }

                const parsedCredentials = userSigninSchema.safeParse(loginCredentials);

                if(!parsedCredentials.success){
                    return null;
                }
              
                try {
                    const existingUser = await db.user.findFirst({
                        where: {
                            phone: credentials.phone
                        }
                    });
                    
                    if (existingUser) {
                        const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                        if (passwordValidation) {
                            return {
                                id: existingUser.id.toString(),
                                name: existingUser.name,
                                phone: existingUser.phone,
                                email: existingUser.email
                            }
                        }
                        return null;
                    }
                    
                    const hashedPassword = await bcrypt.hash(credentials.password, 10);
                    
                    const newUser = await db.user.create({
                        data: {
                            phone: credentials.phone,
                            password: hashedPassword
                        }
                    });
                    
                    await db.balance.create({
                        data: {
                            userId: newUser.id,
                            amount: 0,
                            locked: 0
                        }
                    });

                    return{
                        id: newUser.id.toString(),
                        name: newUser.name,
                        phone: newUser.phone,
                        email: newUser.email
                    }
                } catch(e) {
                    console.error(e);
                }
                return null
            },
        }),
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        async jwt({ token, user }: { token: JWT, user: User}){
            if(user){
                token.id = user.id,
                token.phone = user.phone,
                token.name = user.name,
                token.email = user.email
            }
            return token;
        },
        async session({ token, session }: {token : JWT, session: Session }) {
            if(session.user){
                session.user.id = token.id;
                session.user.phone = token.phone;
                session.user.name = token.name;
                session.user.email = token.email;
            }
            return session || {};
        }
    }
  }
  