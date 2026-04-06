import Joi from "joi";
import { USER_ROLES } from "../utils/constants.js";

export const updateUserRoleSchema = Joi.object({
  role: Joi.string()
    .valid(...Object.values(USER_ROLES))
    .required()
    .messages({
      "any.only": `Role must be one of: ${Object.values(USER_ROLES).join(", ")}`,
      "any.required": "Role is required",
    }),
});

export const updateUserStatusSchema = Joi.object({
  isActive: Joi.boolean().required().messages({
    "any.required": "isActive is required",
  }),
});