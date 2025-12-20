import { z } from "zod";

// Common fields
const uuidSchema = z.string().uuid("Invalid UUID format");

const baseSchema = {
  name: z
    .string()
    .min(3, "Role name must be at least 3 characters")
    .max(50, "Role name must not exceed 50 characters"),
  role_description: z.string().optional(),
  is_active: z.boolean().optional(),
  created_by: z.string().optional(),
  updated_by: z.string().optional(),
};

// ✅ Create Role Schema
export const createRoleSchema = z.object({
  body: z.object({
    ...baseSchema,
  }),
});

// ✅ Update Role Schema
export const updateRoleSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({
    ...baseSchema,
  }).partial(), // all optional
});

// ✅ Get/Delete by ID Schema
export const roleIdSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
});
