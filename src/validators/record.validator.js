import Joi from "joi";
import { RECORD_TYPES } from "../utils/constants.js";

export const createRecordSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be greater than 0",
    "any.required": "Amount is required",
  }),
  type: Joi.string()
    .valid(...Object.values(RECORD_TYPES))
    .required()
    .messages({
      "any.only": `Type must be one of: ${Object.values(RECORD_TYPES).join(", ")}`,
      "any.required": "Type is required",
    }),
  category: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Category is required",
    "any.required": "Category is required",
  }),
  recordDate: Joi.date().iso().required().messages({
    "date.format": "recordDate must be a valid ISO date",
    "any.required": "recordDate is required",
  }),
  notes: Joi.string().trim().allow("", null).max(500).optional(),
});

export const updateRecordSchema = Joi.object({
  amount: Joi.number().positive().optional(),
  type: Joi.string()
    .valid(...Object.values(RECORD_TYPES))
    .optional(),
  category: Joi.string().trim().min(2).max(100).optional(),
  recordDate: Joi.date().iso().optional(),
  notes: Joi.string().trim().allow("", null).max(500).optional(),
}).min(1).messages({
  "object.min": "At least one field is required to update the record",
});

export const recordQuerySchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(RECORD_TYPES))
    .optional(),
  category: Joi.string().trim().min(2).max(100).optional(),
  fromDate: Joi.date().iso().optional(),
  toDate: Joi.date().iso().optional(),
});

export const recentActivityQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(50).optional(),
});