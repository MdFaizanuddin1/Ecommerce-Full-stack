import { Router } from "express";
import { interactWithAi } from "../../controllers/ai/geminiAi.controllers.js";

const router = Router();

router.post("/prompt", interactWithAi);

export default router;
