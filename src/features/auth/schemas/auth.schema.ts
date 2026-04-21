import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Minimal 6 karakter"),
});

export type AuthSchema = z.infer<typeof authSchema>;