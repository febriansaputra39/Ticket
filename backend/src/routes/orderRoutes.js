import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { createOrder, myOrders } from "../controllers/orderController.js";
const router = Router();
router.post("/", authRequired, createOrder);
router.get("/me", authRequired, myOrders);
export default router;
