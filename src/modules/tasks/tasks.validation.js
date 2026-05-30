import { z } from "zod";
import { PRIORITIES } from "../../constants/priorities.js";
import { TASK_STATUS } from "./task.constants.js";

export const createTaskSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
  title: z.string().trim().min(3).max(255),
  description: z.string().max(5000).optional(),
  priority: z.enum([PRIORITIES.LOW, PRIORITIES.MEDIUM, PRIORITIES.HIGH]),
  assignee_id: z.string().uuid("Invalid assignee ID").optional(),
  due_date: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val))
    .refine((date) => date > new Date(), {
      message: "Due date must be in the future",
    }),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(3).max(255).optional(),
    description: z.string().max(5000).optional(),
    priority: z
      .enum([PRIORITIES.LOW, PRIORITIES.MEDIUM, PRIORITIES.HIGH])
      .optional(),
    assignee_id: z.string().uuid("Invalid assignee ID").optional(),
    due_date: z
      .union([z.string(), z.date()])
      .transform((val) => (typeof val === "string" ? new Date(val) : val))
      .refine((date) => date > new Date(), {
        message: "Due date must be in the future",
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const updateStatusSchema = z.object({
  status: z.enum([
    TASK_STATUS.TODO,
    TASK_STATUS.IN_PROGRESS,
    TASK_STATUS.IN_REVIEW,
    TASK_STATUS.DONE,
    TASK_STATUS.BLOCKED,
  ]),
});

export const getTasksSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  status: z
    .enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BLOCKED"])
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  assignee_id: z.string().uuid("Invalid assignee ID").optional(),
});
