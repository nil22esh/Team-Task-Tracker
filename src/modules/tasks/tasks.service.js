import ApiError from "../../utils/ApiError.js";
import { ROLES } from "../../constants/roles.js";
import { TASK_TRANSITIONS } from "./task.constants.js";
import {
  createTask,
  findTaskById,
  updateTask,
  deleteTask,
} from "./tasks.repository.js";
import { findUserById } from "../users/users.repository.js";
import { findProjectById } from "../projects/projects.repository.js";
import { getTasks, countTasks } from "./tasks.repository.js";
import {
  getCachedTasks,
  setCachedTasks,
  getTaskCacheKey,
  invalidateTaskCache,
} from "./tasks.cache.js";

export const createNewTask = async (payload, currentUser) => {
  console.log(payload, currentUser);
  const project = await findProjectById(
    payload.projectId,
    currentUser.organization_id,
  );

  if (!project) {
    throw new ApiError({
      status: 404,
      code: "PROJECT_NOT_FOUND",
      message: "project not found",
    });
  }

  const assignee = await findUserById(payload.assignee_id);
  if (!assignee) {
    throw new ApiError({
      status: 404,
      code: "ASSIGNEE_NOT_FOUND",
      message: "assignee not found",
    });
  }

  if (assignee.organization_id !== currentUser.organization_id) {
    throw new ApiError({
      status: 400,
      code: "INVALID_ASSIGNEE",
      message: "assignee must belong to same organization",
    });
  }
  const task = await createTask({
    ...payload,
    organization_id: currentUser.organization_id,
    createdBy: currentUser.id,
  });

  await invalidateTaskCache(payload.assignee_id);
  return task;
};

export const getTaskById = async (taskId, currentUser) => {
  const task = await findTaskById(taskId, currentUser.organization_id);

  if (!task) {
    throw new ApiError({
      status: 404,
      code: "TASK_NOT_FOUND",
      message: "task not found",
    });
  }
  return task;
};

export const updateExistingTask = async (taskId, payload, currentUser) => {
  const task = await getTaskById(taskId, currentUser);

  if (payload.assignee_id && payload.assignee_id !== task.assignee_id) {
    await invalidateTaskCache(task.assignee_id);

    await invalidateTaskCache(payload.assignee_id);
  }

  return updateTask(taskId, payload);
};

export const removeTask = async (taskId, currentUser) => {
  const task = await getTaskById(taskId, currentUser);

  await deleteTask(taskId);

  await invalidateTaskCache(task.assignee_id);
};

export const updateTaskStatusById = async (taskId, status, currentUser) => {
  const task = await getTaskById(taskId, currentUser);

  const isManager =
    currentUser.role === ROLES.MANAGER || currentUser.role === ROLES.ADMIN;

  const isAssignee = task.assignee_id === currentUser.id;

  if (!isManager && !isAssignee) {
    throw new ApiError({
      status: 403,
      code: "FORBIDDEN",
      message: "access denied",
    });
  }

  const allowedStatuses = TASK_TRANSITIONS[task.status];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError({
      status: 400,
      code: "INVALID_STATUS_TRANSITION",
      message: "invalid status transition",
    });
  }

  const updatedTask = await updateTask(taskId, {
    status,
  });

  await invalidateTaskCache(task.assignee_id);

  return updatedTask;
};

export const getAllTasks = async (query, currentUser) => {
  const page = Number(query.page) || 1;

  const limit = Number(query.limit) || 10;

  const offset = (page - 1) * limit;

  const filters = {
    assignee_id: query.assignee_id,

    page,

    limit,

    status: query.status,

    priority: query.priority,
  };

  const cachedData = await getCachedTasks(filters);

  if (cachedData) {
    return cachedData;
  }

  const tasks = await getTasks({
    organization_id: currentUser.organization_id,

    status: query.status,

    priority: query.priority,

    assignee_id: query.assignee_id,

    limit,

    offset,
  });

  const total = await countTasks({
    organization_id: currentUser.organization_id,

    status: query.status,

    priority: query.priority,

    assignee_id: query.assignee_id,
  });

  const response = {
    tasks,

    pagination: {
      page,

      limit,

      total,

      totalPages: Math.ceil(total / limit),

      hasNextPage: page * limit < total,

      hasPreviousPage: page > 1,
    },
  };

  await setCachedTasks(filters, response);

  return response;
};
