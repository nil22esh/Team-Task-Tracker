import ApiError from "../../utils/ApiError.js";

import {
  createProject,
  findProjectById,
  findProjectByName,
  getProjects,
  countProjects,
  updateProject,
  deleteProject,
} from "./projects.repository.js";

export const createNewProject = async (payload, currentUser) => {
  const existingProject = await findProjectByName(
    payload.name,
    currentUser.organization_id,
  );
  if (existingProject) {
    throw new ApiError({
      status: 409,
      code: "PROJECT_ALREADY_EXISTS",
      message: "project already exists",
    });
  }
  console.log("--->>", existingProject);
  return createProject({
    ...payload,
    organization_id: currentUser.organization_id,
    createdBy: currentUser.id,
  });
};

export const getAllProjects = async (query, currentUser) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = query.search || "";

  const projects = await getProjects({
    organization_id: currentUser.organization_id,
    search,
    limit,
    offset,
  });

  const total = await countProjects({
    organization_id: currentUser.organization_id,
    search,
  });
  return {
    projects,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
};

export const getProjectById = async (projectId, currentUser) => {
  const project = await findProjectById(projectId, currentUser.organization_id);
  if (!project) {
    throw new ApiError({
      status: 404,
      code: "PROJECT_NOT_FOUND",
      message: "project not found",
    });
  }
  return project;
};

export const updateExistingProject = async (
  projectId,
  payload,
  currentUser,
) => {
  await getProjectById(projectId, currentUser);
  return updateProject(projectId, payload);
};

export const removeProject = async (projectId, currentUser) => {
  await getProjectById(projectId, currentUser);
  await deleteProject(projectId);
};
