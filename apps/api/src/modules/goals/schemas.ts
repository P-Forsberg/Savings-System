import { z } from "zod";

export const goalStatusSchema = z.enum(["active", "completed", "paused", "archived"]);

export const createGoalSchema = z.object({
  title: z.string().trim().min(1).max(120),
  targetAmount: z.number().positive(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  plannedMonthlyAmount: z.number().positive(),
  categoryId: z.string().uuid().optional()
}).refine((value) => new Date(value.targetDate) >= new Date(value.startDate), {
  message: "targetDate must be after or equal to startDate",
  path: ["targetDate"]
});

export const updateGoalSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  targetAmount: z.number().positive().optional(),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  plannedMonthlyAmount: z.number().positive().optional(),
  status: goalStatusSchema.optional(),
  categoryId: z.string().uuid().optional()
});
