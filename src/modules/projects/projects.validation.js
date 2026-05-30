import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(2).max(255),
  description: z.string().trim().max(5000).optional().default(""),
});

export const updateProjectSchema = z
  .object({
    name: z.string().trim().min(2).max(255).optional(),
    description: z.string().trim().max(5000).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const getProjectsSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().trim().max(255).optional(),
});
