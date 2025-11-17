import z from "zod";

export const ProfileSchema = z.object({
    email: z.string().email("Paramter email tidak sesuai format"),
    firstName: z.string().min(1, "Paramter firstName tidak sesuai format").nullable(),
    lastName: z.string().min(1, "Paramter lastName tidak sesuai format").nullable(),
    profileImage: z.string().url("Paramter tidak sesuai format").nullable(),
});

export type Profile = z.infer<typeof ProfileSchema>;