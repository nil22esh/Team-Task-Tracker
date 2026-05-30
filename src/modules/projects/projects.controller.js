import asyncHandler from "../../utils/asyncHandler.js";
import {
  createNewProject,
  getAllProjects,
  getProjectById,
  removeProject,
  updateExistingProject,
} from "./projects.service.js";

export const createProject = asyncHandler(async (req, res) => {
  const data = await createNewProject(req.body, req.user);
  return res.status(201).json({
    success: true,
    data,
  });
});

export const getProjects = asyncHandler(async (req, res) => {
  const data = await getAllProjects(req.query, req.user);
  return res.status(200).json({
    success: true,
    data,
  });
});

export const getProject = asyncHandler(async (req, res) => {
  const data = await getProjectById(req.params.id, req.user);
  return res.status(200).json({
    success: true,
    data,
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const data = await updateExistingProject(req.params.id, req.body, req.user);
  return res.status(200).json({
    success: true,
    data,
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  await removeProject(req.params.id, req.user);
  return res.status(200).json({
    success: true,
    message: "project deleted successfully",
  });
});
