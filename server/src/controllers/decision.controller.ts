import { Request, Response } from "express";
import { getPendingDecisions, resolveDecision } from "../services/decision.service";

export const getPendingDecisionsHandler = async (req: Request, res: Response) => {
  try {
    const worldId = req.params.worldId as string;
    const decisions = await getPendingDecisions(worldId);
    res.json({ success: true, decisions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch pending decisions" });
  }
};

export const resolveDecisionHandler = async (req: Request, res: Response) => {
  try {
    const decisionId = req.params.decisionId as string;
    const { choiceIndex } = req.body;
    
    await resolveDecision(decisionId, Number(choiceIndex));
    res.json({ success: true, message: "Decision resolved successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to resolve decision"
    });
  }
};
