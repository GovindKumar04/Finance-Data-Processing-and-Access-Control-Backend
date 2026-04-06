import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../utils/constants.js";

const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const dataToValidate = req[property];

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);

      return next(
        new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "Validation failed",
          errors
        )
      );
    }

    req[property] = value;
    next();
  };
};

export default validate;