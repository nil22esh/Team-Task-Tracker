import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import userRouter from "../modules/users/users.routes.js";
import projectRouter from "../modules/projects/projects.routes.js";
import taskRouter from "../modules/tasks/tasks.routes.js";
import uploadRouter from "../modules/uploads/uploads.routes.js";

const router = Router();

// api health check
router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    status: 200,
    message: "server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// auth routes
router.use("/auth", authRoutes);
router.use("/users", userRouter);
router.use("/projects", projectRouter);
router.use("/tasks", taskRouter);
router.use("/uploads", uploadRouter);

export default router;
