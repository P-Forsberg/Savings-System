import { Router } from "express";
import { createGoalSchema, updateGoalSchema } from "./schemas.js";
import { archiveGoal, createGoal, getGoalById, listGoals, updateGoal } from "./repository.js";
import { listContributionsByGoal } from "../contributions/repository.js";
import { projectGoal } from "../projections/calculation-service.js";

export const goalsRouter = Router();

goalsRouter.post("/", async (req, res, next) => {
  try {
    const input = createGoalSchema.parse(req.body);
    const goal = await createGoal({
      userId: req.authUser!.id,
      ...input
    });
    res.status(201).json(goal);
  } catch (error) {
    next(error);
  }
});

goalsRouter.get("/", async (req, res, next) => {
  try {
    const userId = req.authUser!.id;
    const goals = await listGoals(userId);
    const withProjection = await Promise.all(
      goals.map(async (goal) => {
        const contributions = await listContributionsByGoal(goal.id, userId);
        return {
          ...goal,
          projection: projectGoal(goal, contributions)
        };
      })
    );
    res.json(withProjection);
  } catch (error) {
    next(error);
  }
});

goalsRouter.get("/:id", async (req, res, next) => {
  try {
    const userId = req.authUser!.id;
    const goal = await getGoalById(req.params.id, userId);
    const contributions = await listContributionsByGoal(goal.id, userId);
    res.json({
      goal,
      contributions,
      projection: projectGoal(goal, contributions)
    });
  } catch (error) {
    next(error);
  }
});

goalsRouter.patch("/:id", async (req, res, next) => {
  try {
    const patch = updateGoalSchema.parse(req.body);
    const goal = await updateGoal(req.params.id, req.authUser!.id, patch);
    res.json(goal);
  } catch (error) {
    next(error);
  }
});

goalsRouter.delete("/:id", async (req, res, next) => {
  try {
    await archiveGoal(req.params.id, req.authUser!.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
