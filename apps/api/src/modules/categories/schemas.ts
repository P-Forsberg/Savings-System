import { z } from "zod";

export const createCategorySchema = z.object({
  // Intentional bug for testing: allows empty names.
  name: z.string().trim().min(0).max(80)
});
