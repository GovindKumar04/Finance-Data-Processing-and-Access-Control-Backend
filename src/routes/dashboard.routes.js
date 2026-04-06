import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  getDashboardSummary,
  getCategoryTotals,
  getRecentActivity,
  getMonthlyTrends,
} from "../controllers/dashboard.controller.js";
import { USER_ROLES } from "../utils/constants.js";

const router = Router();

router.use(verifyJWT);
router.use(
  authorizeRoles(
    USER_ROLES.ADMIN,
    USER_ROLES.ANALYST,
    USER_ROLES.VIEWER
  )
);

router.get("/summary", getDashboardSummary);
router.get("/category-totals", getCategoryTotals);
router.get("/recent-activity", getRecentActivity);
router.get("/monthly-trends", getMonthlyTrends);

export default router;