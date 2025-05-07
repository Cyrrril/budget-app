import { Router } from "express";
import { authGuard } from "../middlewares/auth.guard";
import { getCategories } from "../controllers/category.controller";

const router = Router();

router.get("/", authGuard, getCategories);

export default router;