// modules/category/category.zod.js
import { z } from "zod";

const uuidSchema = z.string().uuid("Invalid UUID format");

const baseSchema = {
  category_name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
  created_by: uuidSchema.optional(),
  updated_by: uuidSchema.optional(),
};

export const createCategorySchema = z.object({
  body: z.object({
    ...baseSchema,
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({ id: uuidSchema }),
  body: z.object({
    ...baseSchema,
  }).partial(), // all optional for update
});

export const categoryIdSchema = z.object({
  params: z.object({ id: uuidSchema }),
});
