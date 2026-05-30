import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/rbac.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { ROLES } from "../../constants/roles.js";
import {
  createTaskSchema,
  updateTaskSchema,
  updateStatusSchema,
} from "./tasks.validation.js";
import {
  createTask,
  getTask,
  updateTask,
  deleteTask,
  getTasks,
  updateTaskStatus,
} from "./tasks.controller.js";

const taskRouter = Router();

taskRouter.use(authenticate);

taskRouter.post(
  "/",
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  validate(createTaskSchema),
  createTask,
);

taskRouter.get("/", getTasks);

taskRouter.get("/:id", getTask);

taskRouter.patch(
  "/:id",
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  validate(updateTaskSchema),
  updateTask,
);

taskRouter.delete(
  "/:id",
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  deleteTask,
);

taskRouter.patch("/:id/status", validate(updateStatusSchema), updateTaskStatus);

export default taskRouter;
