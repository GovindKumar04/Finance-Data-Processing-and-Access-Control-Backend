import ApiError from "../utils/ApiError.js";
import {
  HTTP_STATUS,
  ROLE_PERMISSIONS,
} from "../utils/constants.js";

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new ApiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized access")
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          "You do not have permission to perform this action"
        )
      );
    }

    next();
  };
};

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new ApiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized access")
      );
    }

    const rolePermissions = ROLE_PERMISSIONS[req.user.role] || [];

    if (!rolePermissions.includes(permission)) {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          "You do not have permission to perform this action"
        )
      );
    }

    next();
  };
};

export const requireAnyPermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new ApiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized access")
      );
    }

    const rolePermissions = ROLE_PERMISSIONS[req.user.role] || [];

    const hasAtLeastOnePermission = permissions.some((permission) =>
      rolePermissions.includes(permission)
    );

    if (!hasAtLeastOnePermission) {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          "You do not have permission to perform this action"
        )
      );
    }

    next();
  };
};