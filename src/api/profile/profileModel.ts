import z from "zod";

export const ProfileSchema = z.object({
    email: z.string().email("Paramter email tidak sesuai format"),
    firstName: z.string().min(1, "Paramter firstName tidak sesuai format").nullable(),
    lastName: z.string().min(1, "Paramter lastName tidak sesuai format").nullable(),
    profileImage: z.string().url("Paramter tidak sesuai format").nullable(),
});

export type Profile = z.infer<typeof ProfileSchema>;

// Input Validation for 'PUT /profile/update' endpoint
export const UpdateProfileSchema = z.object({
  firstName: z.string({invalid_type_error: "Paramter firstName tidak sesuai format"}).min(1, "Paramter firstName tidak sesuai format").nullable().optional(),
  lastName: z.string({invalid_type_error: "Paramter lastName tidak sesuai format"}).min(1, "Paramter lastName tidak sesuai format").nullable().optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;