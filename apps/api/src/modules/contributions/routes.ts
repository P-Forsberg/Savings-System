import { Router } from "express";
import { createContributionSchema, updateContributionSchema } from "./schemas.js";
import {
  createContribution,
  deleteContribution,
  listContributionsByGoal,
  updateContribution
} from "./repository.js";

export const contributionsRouter = Router();

contributionsRouter.post("/goals/:id/contributions", async (req, res, next) => {
  try {
    const payload = createContributionSchema.parse(req.body);
    const contribution = await createContribution({
      goalId: req.params.id,
      userId: req.authUser!.id,
      ...payload
    });
    res.status(201).json(contribution);
  } catch (error) {
    next(error);
  }
});

contributionsRouter.get("/goals/:id/contributions", async (req, res, next) => {
  try {
    const contributions = await listContributionsByGoal(req.params.id, req.authUser!.id);
    res.json(contributions);
  } catch (error) {
    next(error);
  }
});

contributionsRouter.patch("/contributions/:contributionId", async (req, res, next) => {
  try {
    const patch = updateContributionSchema.parse(req.body);
    const contribution = await updateContribution(req.params.contributionId, req.authUser!.id, patch);
    res.json(contribution);
  } catch (error) {
    next(error);
  }
});

contributionsRouter.delete("/contributions/:contributionId", async (req, res, next) => {
  try {
    await deleteContribution(req.params.contributionId, req.authUser!.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
