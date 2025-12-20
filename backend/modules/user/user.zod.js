import { z } from "zod";

// ✅ Common fields
const uuidSchema = z.string().uuid("Invalid UUID format");

const usernameSchema = z
  .string()
  .min(4, "Username must be at least 4 characters")
  .max(20, "Username must not exceed 20 characters");

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(100, "Password must not exceed 100 characters");

const emailSchema = z.string().email("Invalid email address").optional();

const phoneNoSchema = z
  .string()
  .regex(/^[0-9+\-() ]{7,15}$/, "Invalid phone number")
  .optional();

const baseSchema = {
  username: usernameSchema,
  password: z.string().min(6).optional(),
  // ✅ Auto convert "" -> null
  user_role: z
    .string()
    .uuid("Invalid role id")
    .optional()
    .transform((val) => (val === "" ? null : val)),
  email: emailSchema,
  phoneNo: phoneNoSchema,
  address: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),
  is_active: z.boolean().optional(),
  created_by: uuidSchema.optional(),
  updated_by: uuidSchema.optional(),
};

// ✅ Create User Schema
export const createUserSchema = z.object({
  body: z.object({
    ...baseSchema,
    // 👇 removed forced "password" requirement
    // Sequelize will handle defaultValue instead
  }),
});

// ✅ Update User Schema
export const updateUserSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({
    ...baseSchema,
  }).partial(),
});

// ✅ Get/Delete by ID Schema
export const userIdSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
});
