import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  getDashboardSummary,
  getCategoryTotals,
  getRecentActivity,
  getMonthlyTrends,
} from "../controllers/dashboard.controller.js";
import { PERMISSIONS } from "../utils/constants.js";
import { recentActivityQuerySchema } from "../validators/record.validator.js";

const router = Router();

router.use(verifyJWT);
router.use(requirePermission(PERMISSIONS.DASHBOARD_READ));

router.get("/summary", getDashboardSummary);
router.get("/category-totals", getCategoryTotals);
router.get(
  "/recent-activity",
  validate(recentActivityQuerySchema, "query"),
  getRecentActivity
);
router.get("/monthly-trends", getMonthlyTrends);

export default router;