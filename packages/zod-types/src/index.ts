import zod from "zod";

export const userSigninSchema = zod.object({
    phone: zod.string().min(10).max(10),
    password: zod.string().min(8)
});

export type UserSigninSchema = zod.infer<typeof userSigninSchema>;

export const hdfcBankDummyApiSchema = zod.object({
    userId: zod.string(),
    amount: zod.number()
});

export type HdfcBankDummyApiSchema = zod.infer<typeof hdfcBankDummyApiSchema>;

export const hdfcNetBankingSchema = zod.object({
    token: zod.string(),
    amount: zod.number()
});

export type HdfcNetBankingSchema = zod.infer<typeof hdfcNetBankingSchema>;

export const hdfcBankWebhookSchema = zod.object({
    token: zod.string(),
    userId: zod.number(),
    amount: zod.number(),
    secret: zod.string()
});

export const createOnRampTransactionSchema = zod.object({
    amount: zod.number(),
    provider: zod.string(),
    token: zod.string()
});

export const handleP2PTransactionSchema = zod.object({
    recipientNumber: zod.string(),
    amount: zod.number()
});

export const handleSignupSchema = zod.object({
    name: zod.string(),
    email: zod.string(),
    phone: zod.string(),
    password: zod.string()
});