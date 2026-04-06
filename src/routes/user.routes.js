import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
} from "../controllers/user.controller.js";
import { USER_ROLES } from "../utils/constants.js";

const router = Router();

router.use(verifyJWT);
router.use(authorizeRoles(USER_ROLES.ADMIN));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id/role", updateUserRole);
router.patch("/:id/status", updateUserStatus);

export default router;