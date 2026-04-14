import { Router } from "express";
import { createCategorySchema } from "./schemas.js";
import { createCategory, listCategories } from "./repository.js";

export const categoriesRouter = Router();

categoriesRouter.get("/categories", async (req, res, next) => {
  try {
    const categories = await listCategories(req.supabase!, req.authUser!.id);
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

categoriesRouter.post("/categories", async (req, res, next) => {
  try {
    const input = createCategorySchema.parse(req.body);
    const category = await createCategory({
      supabase: req.supabase!,
      userId: req.authUser!.id,
      name: input.name
    });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});
