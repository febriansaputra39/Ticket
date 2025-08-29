import { Router } from "express";
import { listEvents, getEvent } from "../controllers/eventController.js";
const router = Router();
router.get("/", listEvents);
router.get("/:id", getEvent);
export default router;
