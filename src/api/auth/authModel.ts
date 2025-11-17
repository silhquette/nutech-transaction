import { z } from "zod";

export const RegisterSchema = z.object({
    email: z
        .string({
            required_error: "Paramter email tidak sesuai format",
            invalid_type_error: "Paramter email tidak sesuai format",
        })
        .email("Paramter email tidak sesuai format"),
    password: z
        .string({
            required_error: "Paramter password tidak sesuai format",
            invalid_type_error: "Paramter password tidak sesuai format",
        })
        .min(8, "Paramter password tidak sesuai format"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    profileImage: z.string().url("Paramter tidak sesuai format").optional(),
});

export const LoginSchema = z.object({
	email: z.string({
            required_error: "Paramter email tidak sesuai format",
            invalid_type_error: "Paramter email tidak sesuai format",
        }).email("Paramter email tidak sesuai format"),
	password: z.string({
            required_error: "Paramter password tidak sesuai format",
            invalid_type_error: "Paramter password tidak sesuai format",
        }).min(1, "Paramter password tidak sesuai format"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;