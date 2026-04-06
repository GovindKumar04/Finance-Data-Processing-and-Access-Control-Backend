import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/role.middleware.js";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
} from "../controllers/user.controller.js";
import { PERMISSIONS } from "../utils/constants.js";

const router = Router();

router.use(verifyJWT);

router.get(
  "/",
  requirePermission(PERMISSIONS.USERS_READ),
  getAllUsers
);

router.get(
  "/:id",
  requirePermission(PERMISSIONS.USERS_READ_ONE),
  getUserById
);

router.patch(
  "/:id/role",
  requirePermission(PERMISSIONS.USERS_UPDATE_ROLE),
  updateUserRole
);

router.patch(
  "/:id/status",
  requirePermission(PERMISSIONS.USERS_UPDATE_STATUS),
  updateUserStatus
);

export default router;