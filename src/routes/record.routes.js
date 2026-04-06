import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} from "../controllers/record.controller.js";
import { USER_ROLES } from "../utils/constants.js";

const router = Router();

router.use(verifyJWT);

router.get(
  "/",
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.ANALYST),
  getAllRecords
);

router.get(
  "/:id",
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.ANALYST),
  getRecordById
);

router.post(
  "/",
  authorizeRoles(USER_ROLES.ADMIN),
  createRecord
);

router.patch(
  "/:id",
  authorizeRoles(USER_ROLES.ADMIN),
  updateRecord
);

router.delete(
  "/:id",
  authorizeRoles(USER_ROLES.ADMIN),
  deleteRecord
);

export default router;