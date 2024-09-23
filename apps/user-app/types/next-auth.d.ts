import { DefaultSession } from "next-auth";

declare module "next-auth"{
  interface Session{
      user: {
          id: string;
          phone: string;
      }  & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
      id: string;
      phone: string;
  }
}

declare module "next-auth"{
  interface User{
    phone: string;
  }
}