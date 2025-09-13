import { z } from "zod";

export const createApplicationSchema = z.object({
  job_id: z.number().int().positive(),
  candidate_id: z.number().int().positive(),
});

export const updateApplicationSchema = z.object({
  status: z.enum(["applied", "reviewed", "accepted", "rejected"]),
});
