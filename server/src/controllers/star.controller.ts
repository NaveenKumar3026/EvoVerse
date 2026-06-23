import { Request, Response } from "express";
import { getGalaxyData, colonizePlanet } from "../services/star.service";
import {
  getDiplomacyByWorld,
  establishEmbassy,
  proposeTreaty,
  declareRivalry,
  applySanctions
} from "../services/diplomacy.service";

export const getGalaxyDataHandler = async (req: Request, res: Response) => {
  try {
    const worldId = req.params.worldId as string;
    const galaxy = await getGalaxyData(worldId);
    res.json({ success: true, galaxy });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch galaxy data" });
  }
};

export const colonizePlanetHandler = async (req: Request, res: Response) => {
  try {
    const planetId = req.params.planetId as string;
    const { civilizationId } = req.body;
    
    const planet = await colonizePlanet(planetId, civilizationId);
    res.json({ success: true, planet });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to colonize planet" });
  }
};

export const getDiplomacyHandler = async (req: Request, res: Response) => {
  try {
    const worldId = req.params.worldId as string;
    const relationships = await getDiplomacyByWorld(worldId);
    res.json({ success: true, relationships });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch diplomacy data" });
  }
};

export const establishEmbassyHandler = async (req: Request, res: Response) => {
  try {
    const diplomacyId = req.params.diplomacyId as string;
    const rel = await establishEmbassy(diplomacyId);
    res.json({ success: true, rel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to establish embassy" });
  }
};

export const proposeTreatyHandler = async (req: Request, res: Response) => {
  try {
    const diplomacyId = req.params.diplomacyId as string;
    const { treatyType } = req.body;
    const rel = await proposeTreaty(diplomacyId, treatyType);
    res.json({ success: true, rel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to propose treaty" });
  }
};

export const declareRivalryHandler = async (req: Request, res: Response) => {
  try {
    const diplomacyId = req.params.diplomacyId as string;
    const { enabled } = req.body;
    const rel = await declareRivalry(diplomacyId, Boolean(enabled));
    res.json({ success: true, rel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to declare rivalry" });
  }
};

export const applySanctionsHandler = async (req: Request, res: Response) => {
  try {
    const diplomacyId = req.params.diplomacyId as string;
    const { enabled } = req.body;
    const rel = await applySanctions(diplomacyId, Boolean(enabled));
    res.json({ success: true, rel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to apply sanctions" });
  }
};
