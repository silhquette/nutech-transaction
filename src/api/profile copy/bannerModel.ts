import z from "zod";

export const BannerSchema = z.object({
    banner_name: z.string().min(1).max(255),
    banner_image: z.string().url(),
    description: z.string().min(1).max(255),
});

export type Banner = z.infer<typeof BannerSchema>;