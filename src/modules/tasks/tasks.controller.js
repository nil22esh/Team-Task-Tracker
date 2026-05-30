import asyncHandler from "../../utils/asyncHandler.js";
import {
  createNewTask,
  getAllTasks,
  getTaskById,
  removeTask,
  updateExistingTask,
  updateTaskStatusById,
} from "./tasks.service.js";

export const createTask = asyncHandler(async (req, res) => {
  const data = await createNewTask(req.body, req.user);

  return res.status(201).json({
    success: true,
    data,
  });
});

export const getTask = asyncHandler(async (req, res) => {
  const data = await getTaskById(req.params.id, req.user);

  return res.status(200).json({
    success: true,
    data,
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const data = await updateExistingTask(req.params.id, req.body, req.user);

  return res.status(200).json({
    success: true,
    data,
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  await removeTask(req.params.id, req.user);

  return res.status(200).json({
    success: true,
    message: "task deleted successfully",
  });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const data = await updateTaskStatusById(
    req.params.id,
    req.body.status,
    req.user,
  );

  return res.status(200).json({
    success: true,
    data,
  });
});

export const getTasks = asyncHandler(async (req, res) => {
  const data = await getAllTasks(req.query, req.user);

  return res.status(200).json({
    success: true,
    data,
  });
});
