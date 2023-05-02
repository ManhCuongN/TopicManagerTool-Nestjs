import { HTTP_ERROR, HTTP_UNAUTHORIZED } from "./httpCode";

export const UNAUTHORIZED_MESSAGE = {
  message: "unauthorized",
  status: HTTP_UNAUTHORIZED,
};

export const EXPIRED_TOKEN_MESSAGE = {
  message: "your token has expired",
  status: HTTP_ERROR
};

export const OVER_REGISTER_MESSAGE = {
  message: "The topic reached limit request",
  status: HTTP_ERROR,
};

