import {scrapWebsite, askQuestion} from "../controllers/faq.controller.js";
import { Router } from "express";

const router = Router();

router.post("/scrap", scrapWebsite);
router.post("/ask", askQuestion);

export default router;