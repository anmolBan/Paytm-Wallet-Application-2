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
                phone: { type: "text" },
                password: { type: "password" }
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
                    throw new Error("Invalid inputs");
                }
              
                try {
                    const existingUser = await db.user.findFirst({
                        where: {
                            phone: credentials.phone
                        }
                    });

                    if(!existingUser){
                        throw new Error("Incorrect username or password");
                    }
                    
                    const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);

                    if(!passwordValidation){
                        throw new Error("Incorrect password");
                    }

                    return{
                        id: existingUser.id.toString(),
                        name: existingUser.name,
                        phone: existingUser.phone,
                        email: existingUser.email
                    }
                }
                    
                catch(error:any) {
                    console.error(error);
                    throw new Error(error.message || "Login failed please try again later.....")
                }
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
    },
    pages: {
        signIn: "/signin",
        error: "/signin"
    }
}
  