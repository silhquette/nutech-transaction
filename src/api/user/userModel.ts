import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const UserSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  password: z.string(),
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  profile_image: z.string().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional().nullable(),
});

export type User = z.infer<typeof UserSchema>;

// Public schema untuk response (tanpa password)
export const PublicUserSchema = UserSchema.omit({ password: true });

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: z.string().cuid() }),
});

// Input Validation for 'POST users' endpoint
export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  profile_image: z.string().url().optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

// Input Validation for 'PUT users/:id' endpoint
export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  profile_image: z.string().url().optional().nullable(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;