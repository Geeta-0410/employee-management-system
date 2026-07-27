import { Router } from "express";
import { verifyAuth } from "../middleware/authMiddleware";
import { chatWithAI } from "../controllers/aiController";

const router = Router();
router.post("/chat", verifyAuth, chatWithAI);

export default router;