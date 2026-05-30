import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { register, login, logout, refreshAccessToken } from "./auth.service.js";
import { REFRESH_TOKEN_COOKIE_OPTIONS } from "./auth.constants.js";

export const registerUser = asyncHandler(async (req, res) => {
  const result = await register(req.body);

  res.cookie("refreshToken", result.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  return res.status(201).json(
    new ApiResponse(201, "user registered successfully", {
      user: result.user,
      accessToken: result.accessToken,
    }),
  );
});

export const loginUser = asyncHandler(async (req, res) => {
  const result = await login(req.body);

  res.cookie("refreshToken", result.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  return res.status(200).json(
    new ApiResponse(200, "login successful", {
      user: result.user,
      accessToken: result.accessToken,
    }),
  );
});

export const refreshTokenForUser = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken || req.cookies.refreshToken;
  const result = await refreshAccessToken(token);

  res.cookie("refreshToken", result.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  return res.status(200).json(
    new ApiResponse(200, "token refreshed successfully", {
      accessToken: result.accessToken,
    }),
  );
});

export const logoutUser = asyncHandler(async (req, res) => {
  console.log(req.user);
  await logout(req.user.id);
  res.clearCookie("refreshToken");
  return res.status(200).json(new ApiResponse(200, "logout successful"));
});
