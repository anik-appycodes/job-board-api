import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["candidate", "employer"]),
  company_id: z.number().optional(),
});

export const updateUserSchema = createUserSchema.partial();
