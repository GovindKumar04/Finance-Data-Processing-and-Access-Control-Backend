import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  getAllUsersService,
  getUserByIdService,
  updateUserRoleService,
  updateUserStatusService,
} from "../services/user.service.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService();

  return res
    .status(200)
    .json(new ApiResponse(200, "Users fetched successfully", users));
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await getUserByIdService(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "User fetched successfully", user));
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  const updatedUser = await updateUserRoleService(req.params.id, role);

  return res
    .status(200)
    .json(new ApiResponse(200, "User role updated successfully", updatedUser));
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  const updatedUser = await updateUserStatusService(req.params.id, isActive);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "User active status updated successfully", updatedUser)
    );
});