import { Router } from "express";
import { getGoalById } from "../goals/repository.js";
import { listContributionsByGoal } from "../contributions/repository.js";
import { projectGoal } from "./calculation-service.js";

export const projectionsRouter = Router();

projectionsRouter.get("/goals/:id/projection", async (req, res, next) => {
  try {
    const userId = req.authUser!.id;
    const goal = await getGoalById(req.params.id, userId);
    const contributions = await listContributionsByGoal(goal.id, userId);
    res.json(projectGoal(goal, contributions));
  } catch (error) {
    next(error);
  }
});
