import { Router } from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "./projects.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/rbac.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { ROLES } from "../../constants/roles.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "./projects.validation.js";

const projectRouter = Router();

projectRouter.use(authenticate);

projectRouter.use(authorizeRoles(ROLES.ADMIN, ROLES.MANAGER));

projectRouter.post("/", validate(createProjectSchema), createProject);

projectRouter.get("/", getProjects);

projectRouter.get("/:id", getProject);

projectRouter.patch("/:id", validate(updateProjectSchema), updateProject);

projectRouter.delete("/:id", deleteProject);

export default projectRouter;
