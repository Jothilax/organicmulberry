import { z } from "zod";

// ✅ Create Product Schema
export const createProductSchema = z.object({
  body: z.object({
    category_id: z.string().uuid("Category ID must be a valid UUID"),
    brand: z.string().min(1, "Brand is required"),
    name: z.string().min(1, "Name is required"),
    color: z.string().optional(),
    pattern: z.string().optional(),
    style: z.string().optional(),
    material: z.string().optional(),
    threadCount: z.coerce.number().optional(),
    size: z.string().uuid().optional(),
    dimensions: z.string().optional(),
    pocketDepth: z.string().optional(),
    weight: z.string().optional(),
    countryOfOrigin: z.string().optional(),
    price: z.coerce.number().optional(),
    mrp: z.coerce.number().optional(),
    discountPercent: z.coerce.number().optional(),
    description: z.string().optional(),
    includedComponents: z.string().optional(),
    imageUrl: z.string().url().optional(),
    rating: z.coerce.number().optional(),
    reviewsCount: z.coerce.number().optional(),
    link: z.string().url().optional(),
    stock: z.coerce.number().optional(),
    is_active: z.coerce.boolean().optional(),
  }),
});

// ✅ Update Product Schema
export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid product ID"),
  }),
  body: z.object({
    category_id: z.string().uuid().optional(),
    brand: z.string().optional(),
    name: z.string().optional(),
    color: z.string().optional(),
    pattern: z.string().optional(),
    style: z.string().optional(),
    material: z.string().optional(),
    threadCount: z.coerce.number().optional(),
    size: z.string().uuid().optional(),
    dimensions: z.string().optional(),
    pocketDepth: z.string().optional(),
    weight: z.string().optional(),
    countryOfOrigin: z.string().optional(),
    price: z.coerce.number().optional(),
    mrp: z.coerce.number().optional(),
    discountPercent: z.coerce.number().optional(),
    description: z.string().optional(),
    includedComponents: z.string().optional(),
    imageUrl: z.string().url().optional(),
    rating: z.coerce.number().optional(),
    reviewsCount: z.coerce.number().optional(),
    link: z.string().url().optional(),
    stock: z.coerce.number().optional(),
    is_active: z.coerce.boolean().optional(),
  }),
});

// ✅ Product ID Schema
export const productIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid product ID"),
  }),
});
