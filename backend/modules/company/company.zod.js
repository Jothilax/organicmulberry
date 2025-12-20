import { z } from "zod";

export const createCompanySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Company name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().optional(),
    address: z.string().optional(),
    website: z.string().url("Invalid website URL").optional(),
    certificationType: z.string().optional(),
    created_by: z.string().optional(),
  }),
});

export const updateCompanySchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    website: z.string().url().optional(),
    certificationType: z.string().optional(),
    updated_by: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid("Invalid company ID"),
  }),
});
