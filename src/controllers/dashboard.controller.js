import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  getDashboardSummaryService,
  getCategoryTotalsService,
  getRecentActivityService,
  getMonthlyTrendsService,
} from "../services/dashboard.service.js";

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const summary = await getDashboardSummaryService();

  return res
    .status(200)
    .json(new ApiResponse(200, "Dashboard summary fetched successfully", summary));
});

export const getCategoryTotals = asyncHandler(async (req, res) => {
  const data = await getCategoryTotalsService();

  return res
    .status(200)
    .json(new ApiResponse(200, "Category totals fetched successfully", data));
});

export const getRecentActivity = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const data = await getRecentActivityService(limit);

  return res
    .status(200)
    .json(new ApiResponse(200, "Recent activity fetched successfully", data));
});

export const getMonthlyTrends = asyncHandler(async (req, res) => {
  const data = await getMonthlyTrendsService();

  return res
    .status(200)
    .json(new ApiResponse(200, "Monthly trends fetched successfully", data));
});