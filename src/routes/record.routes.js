import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/role.middleware.js";
import {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} from "../controllers/record.controller.js";
import { PERMISSIONS } from "../utils/constants.js";

const router = Router();

router.use(verifyJWT);

router.get(
  "/",
  requirePermission(PERMISSIONS.RECORDS_READ),
  getAllRecords
);

router.get(
  "/:id",
  requirePermission(PERMISSIONS.RECORDS_READ),
  getRecordById
);

router.post(
  "/",
  requirePermission(PERMISSIONS.RECORDS_CREATE),
  createRecord
);

router.patch(
  "/:id",
  requirePermission(PERMISSIONS.RECORDS_UPDATE),
  updateRecord
);

router.delete(
  "/:id",
  requirePermission(PERMISSIONS.RECORDS_DELETE),
  deleteRecord
);

export default router;