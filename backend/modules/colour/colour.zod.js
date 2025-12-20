import { z } from "zod";

// ✅ Reusable UUID schema
const uuidSchema = z.string().uuid("Invalid UUID format");

// ✅ Base color fields
const baseSchema = {
  color_name: z.string().min(2, "Color name must be at least 2 characters long"),
  color_code: z.string().min(1, "Color code is required"),
  is_active: z.boolean().optional(),
  created_by: uuidSchema.optional(),
  updated_by: uuidSchema.optional(),
};

// ➕ Create Color
export const createColorSchema = z.object({
  body: z.object({
    ...baseSchema,
  }),
});

// ✏️ Update Color
export const updateColorSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({
    ...baseSchema,
  }).partial(), // all optional for update
});

// 🔍 Get/Delete by ID
export const colorIdSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
});
