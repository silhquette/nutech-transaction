import z from "zod";

export const ServiceSchema = z.object({
    service_code: z.string().min(1).max(100),
    service_name: z.string().min(1).max(100),
    service_icon: z.string().url(),
    service_tarif: z.number().int().nonnegative(),
});

export type Service = z.infer<typeof ServiceSchema>;