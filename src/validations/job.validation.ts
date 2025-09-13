import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  location: z.string().optional(),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  tags: z.array(z.string()).optional(),
  company_id: z.number(),
  posted_by: z.number(),
});

export const updateJobSchema = createJobSchema.partial();
