import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { registerUserService, loginUserService, getCurrentUserService } from "../services/auth.service.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const data = await registerUserService({ name, email, password });

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", data));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const data = await loginUserService({ email, password });

  return res
    .status(200)
    .json(new ApiResponse(200, "User logged in successfully", data));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await getCurrentUserService(req.user.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Current user fetched successfully", user));
});