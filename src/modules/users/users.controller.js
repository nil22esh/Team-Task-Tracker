import asyncHandler from "../../utils/asyncHandler.js";
import {
  createNewUser,
  getAllUsers,
  getUserById,
  removeUser,
  updateExistingUser,
} from "./users.service.js";

export const createUser = asyncHandler(async (req, res) => {
  const data = await createNewUser(req.body, req.user);
  res.status(201).json({
    success: true,
    data,
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const data = await getAllUsers(req.query, req.user);
  res.status(200).json({
    success: true,
    data,
  });
});

export const getUser = asyncHandler(async (req, res) => {
  const data = await getUserById(req.params.id, req.user);
  res.status(200).json({
    success: true,
    data,
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const data = await updateExistingUser(req.params.id, req.body, req.user);
  res.status(200).json({
    success: true,
    data,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await removeUser(req.params.id, req.user);
  res.status(200).json({
    success: true,
    message: "user deleted successfully",
  });
});
