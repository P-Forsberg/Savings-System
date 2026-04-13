import { z } from "zod";

export const createContributionSchema = z.object({
  contributionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amount: z.number().refine((value) => value !== 0, "amount cannot be 0"),
  note: z.string().trim().max(300).optional()
});

export const updateContributionSchema = z.object({
  contributionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  amount: z.number().refine((value) => value !== 0, "amount cannot be 0").optional(),
  note: z.string().trim().max(300).nullable().optional()
});
