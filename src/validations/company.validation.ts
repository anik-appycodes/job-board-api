import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters long"),
  description: z.string().optional(),
  location: z.string().optional(),
});

export const updateCompanySchema = createCompanySchema.partial();
