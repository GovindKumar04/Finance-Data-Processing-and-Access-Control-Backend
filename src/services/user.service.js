import pool from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import { USER_ROLES, HTTP_STATUS } from "../utils/constants.js";

const sanitizeUser = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.is_active,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};

export const getAllUsersService = async () => {
  const query = `
    SELECT id, name, email, role, is_active, created_at, updated_at
    FROM users
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query);

  return result.rows.map(sanitizeUser);
};

export const getUserByIdService = async (userId) => {
  const query = `
    SELECT id, name, email, role, is_active, created_at, updated_at
    FROM users
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [userId]);

  if (result.rows.length === 0) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
  }

  return sanitizeUser(result.rows[0]);
};

export const updateUserRoleService = async (userId, role) => {
  if (!role) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Role is required");
  }

  const allowedRoles = Object.values(USER_ROLES);

  if (!allowedRoles.includes(role)) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      `Invalid role. Allowed roles: ${allowedRoles.join(", ")}`
    );
  }

  const query = `
    UPDATE users
    SET role = $1
    WHERE id = $2
    RETURNING id, name, email, role, is_active, created_at, updated_at
  `;

  const result = await pool.query(query, [role, userId]);

  if (result.rows.length === 0) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
  }

  return sanitizeUser(result.rows[0]);
};

export const updateUserStatusService = async (userId, isActive) => {
  if (typeof isActive !== "boolean") {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "isActive must be a boolean value"
    );
  }

  const query = `
    UPDATE users
    SET is_active = $1
    WHERE id = $2
    RETURNING id, name, email, role, is_active, created_at, updated_at
  `;

  const result = await pool.query(query, [isActive, userId]);

  if (result.rows.length === 0) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
  }

  return sanitizeUser(result.rows[0]);
};