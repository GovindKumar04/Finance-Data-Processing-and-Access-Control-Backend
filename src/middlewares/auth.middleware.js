import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { HTTP_STATUS } from "../utils/constants.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Access token is missing");
  }

  const token = authHeader.split(" ")[1];

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid or expired token");
  }

  const query = `
    SELECT id, name, email, role, is_active, created_at, updated_at
    FROM users
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [decodedToken.id]);

  if (result.rows.length === 0) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not found for this token");
  }

  const user = result.rows[0];

  if (!user.is_active) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "Your account is inactive");
  }

  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.is_active,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };

  next();
});