// modules/size/size.zod.js
import { z } from "zod";

const uuidSchema = z.string().uuid("Invalid UUID format");

const baseSchema = {
  size_name: z.string().min(1, "Size name is required"),
  size_description: z.string().optional(),
  is_active: z.boolean().optional(),
};

export const createSizeSchema = z.object({
  body: z.object({
    ...baseSchema,
  }),
});

export const updateSizeSchema = z.object({
  params: z.object({ id: uuidSchema }),
  body: z.object({
    ...baseSchema,
  }).partial(), // all fields optional for update
});

export const sizeIdSchema = z.object({
  params: z.object({ id: uuidSchema }),
});
