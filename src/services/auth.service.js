import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import { USER_ROLES, HTTP_STATUS } from "../utils/constants.js";

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

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

export const registerUserService = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Name, email, and password are required");
  }

  if (password.length < 6) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Password must be at least 6 characters long");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUserQuery = `
    SELECT id FROM users WHERE email = $1 LIMIT 1
  `;
  const existingUserResult = await pool.query(existingUserQuery, [normalizedEmail]);

  if (existingUserResult.rows.length > 0) {
    throw new ApiError(HTTP_STATUS.CONFLICT, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const insertUserQuery = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, is_active, created_at, updated_at
  `;

  const insertUserValues = [
    name.trim(),
    normalizedEmail,
    hashedPassword,
    USER_ROLES.VIEWER,
  ];

  const result = await pool.query(insertUserQuery, insertUserValues);
  const user = result.rows[0];

  const token = generateAccessToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
};

export const loginUserService = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const findUserQuery = `
    SELECT id, name, email, password, role, is_active, created_at, updated_at
    FROM users
    WHERE email = $1
    LIMIT 1
  `;

  const result = await pool.query(findUserQuery, [normalizedEmail]);

  if (result.rows.length === 0) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
  }

  const user = result.rows[0];

  if (!user.is_active) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "Your account is inactive. Please contact admin");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
  }

  const token = generateAccessToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
};

export const getCurrentUserService = async (userId) => {
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