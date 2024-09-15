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