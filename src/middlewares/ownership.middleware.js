import prisma from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import { ROLES } from "../constants/roles.js";

// validate task ownership access
export const canAccessTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    // fetch task details
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      select: {
        id: true,
        assignee_id: true,
        createdById: true,
      },
    });

    // validate task existence
    if (!task) {
      return next(new ApiError(404, "TASK_NOT_FOUND", "task does not exist"));
    }

    const isAdmin = req.user.role === ROLES.ADMIN;

    const isManager = req.user.role === ROLES.MANAGER;

    const isAssignee = req.user.id === task.assignee_id;

    // validate task access permission
    if (!isAdmin && !isManager && !isAssignee) {
      return next(
        new ApiError(
          403,
          "FORBIDDEN",
          "you are not allowed to access this task",
        ),
      );
    }
    // attach task metadata
    req.task = task;
    next();
  } catch (error) {
    next(error);
  }
};
