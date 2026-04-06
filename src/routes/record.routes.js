import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} from "../controllers/record.controller.js";
import { PERMISSIONS } from "../utils/constants.js";
import {
  createRecordSchema,
  updateRecordSchema,
  recordQuerySchema,
} from "../validators/record.validator.js";

const router = Router();

router.use(verifyJWT);

router.get(
  "/",
  requirePermission(PERMISSIONS.RECORDS_READ),
  validate(recordQuerySchema, "query"),
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
  validate(createRecordSchema),
  createRecord
);

router.patch(
  "/:id",
  requirePermission(PERMISSIONS.RECORDS_UPDATE),
  validate(updateRecordSchema),
  updateRecord
);

router.delete(
  "/:id",
  requirePermission(PERMISSIONS.RECORDS_DELETE),
  deleteRecord
);

export default router;