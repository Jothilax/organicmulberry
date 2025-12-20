// import { z } from "zod";

// export const signupSchema = z.object({
//   email: z.string().email().optional(),
//   phone: z.string().min(10).max(15).optional(),
// });

// export const updateProfileSchema = z.object({
//   name: z.string().max(100).optional(),
//   gender: z.enum(["Male", "Female", "Other"]).optional(),
//   email: z.string().email().optional(),
//   phone: z.string().min(10).max(15).optional(),
//   address: z.string().optional(),
//   country: z.string().optional(),
//   state: z.string().optional(),
//   city: z.string().optional(),
//   pincode: z.string().optional(),
//   landmark: z.string().optional()
  
// });


import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().min(10).max(15).optional(),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone is required",
  });

export const updateProfileSchema = z.object({
  name: z.string().max(100).optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(15).optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),
  landmark: z.string().optional(),
});
