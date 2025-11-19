import z from "zod";

export const ProfileSchema = z.object({
  email: z.string({
    required_error: "Paramter email tidak sesuai format",
    invalid_type_error: "Paramter email tidak sesuai format",
  }).email("Paramter email tidak sesuai format"),
  first_name: z.string({
    required_error: "Paramter first_name tidak sesuai format",
    invalid_type_error: "Paramter first_name tidak sesuai format",
  }).min(1, "Paramter first_name tidak sesuai format").nullable(),
  last_name: z.string({
    required_error: "Paramter last_name tidak sesuai format",
    invalid_type_error: "Paramter last_name tidak sesuai format",
  }).min(1, "Paramter last_name tidak sesuai format").nullable(),
  profile_image: z.string().url("Paramter tidak sesuai format").nullable(),
});

export type Profile = z.infer<typeof ProfileSchema>;

// Input Validation for 'PUT /profile/update' endpoint
export const UpdateProfileSchema = z.object({
  first_name: z.string({ invalid_type_error: "Paramter first_name tidak sesuai format" }).min(1, "Paramter first_name tidak sesuai format").nullable().optional(),
  last_name: z.string({ invalid_type_error: "Paramter last_name tidak sesuai format" }).min(1, "Paramter last_name tidak sesuai format").nullable().optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export const ProfileImageResponseSchema = z.object({
  email: z.string({
    required_error: "Paramter email tidak sesuai format",
    invalid_type_error: "Paramter email tidak sesuai format",
  }).email("Paramter email tidak sesuai format"),
  first_name: z.string({
    required_error: "Paramter first_name tidak sesuai format",
    invalid_type_error: "Paramter first_name tidak sesuai format",
  }).nullable(),
  last_name: z.string({
    required_error: "Paramter last_name tidak sesuai format",
    invalid_type_error: "Paramter last_name tidak sesuai format",
  }).nullable(),
  profile_image: z.string({
    required_error: "Paramter profile_image tidak sesuai format",
    invalid_type_error: "Paramter profile_image tidak sesuai format",
  }).url("Paramter tidak sesuai format").nullable(),
});

export type ProfileImageResponse = z.infer<typeof ProfileImageResponseSchema>;