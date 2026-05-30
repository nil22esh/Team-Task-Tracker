import { z } from "zod";
import { ROLES } from "../../constants/roles.js";

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(50),
  role: z.enum([ROLES.MANAGER, ROLES.MEMBER]),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    role: z.enum([ROLES.MANAGER, ROLES.MEMBER]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const getUsersSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  role: z.enum([ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER]).optional(),
  search: z.string().trim().max(100).optional(),
});
