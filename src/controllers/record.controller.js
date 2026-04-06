import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createRecordService,
  getAllRecordsService,
  getRecordByIdService,
  updateRecordService,
  deleteRecordService,
} from "../services/record.service.js";

export const createRecord = asyncHandler(async (req, res) => {
  const { amount, type, category, recordDate, notes } = req.body;

  const record = await createRecordService({
    amount,
    type,
    category,
    recordDate,
    notes,
    createdBy: req.user.id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Record created successfully", record));
});

export const getAllRecords = asyncHandler(async (req, res) => {
  const { type, category, fromDate, toDate } = req.query;

  const records = await getAllRecordsService({
    type,
    category,
    fromDate,
    toDate,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Records fetched successfully", records));
});

export const getRecordById = asyncHandler(async (req, res) => {
  const record = await getRecordByIdService(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Record fetched successfully", record));
});

export const updateRecord = asyncHandler(async (req, res) => {
  const { amount, type, category, recordDate, notes } = req.body;

  const updatedRecord = await updateRecordService(req.params.id, {
    amount,
    type,
    category,
    recordDate,
    notes,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Record updated successfully", updatedRecord));
});

export const deleteRecord = asyncHandler(async (req, res) => {
  const deletedRecord = await deleteRecordService(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Record deleted successfully", deletedRecord));
});