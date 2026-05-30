import { Router } from "express";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "./users.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/rbac.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { ROLES } from "../../constants/roles.js";
import { createUserSchema, updateUserSchema } from "./users.validation.js";

const userRouter = Router();

userRouter.use(authenticate);
userRouter.use(authorizeRoles(ROLES.ADMIN));

userRouter.post("/", validate(createUserSchema), createUser);

userRouter.get("/", getUsers);

userRouter.get("/:id", getUser);

userRouter.patch("/:id", validate(updateUserSchema), updateUser);

userRouter.delete("/:id", deleteUser);

export default userRouter;
