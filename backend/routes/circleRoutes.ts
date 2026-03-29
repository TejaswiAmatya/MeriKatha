import express from "express";
import {
  getJoinedCircles,
  getCircle,
  getCircleStories,
  joinCircle,
  leaveCircle,
} from "../controllers/circleControllers";
import { requireAuth } from "../middleware/auth";

const circleRouter = express.Router();

// /circles/joined MUST be before /circles/:slug to avoid "joined" being matched as a slug
circleRouter.get("/circles/joined", requireAuth, getJoinedCircles);
circleRouter.get("/circles/:slug", getCircle);
circleRouter.get("/circles/:slug/stories", getCircleStories);
circleRouter.post("/circles/:slug/join", requireAuth, joinCircle);
circleRouter.post("/circles/:slug/leave", requireAuth, leaveCircle);

export default circleRouter;
