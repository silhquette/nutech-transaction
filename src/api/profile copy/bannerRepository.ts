import { Banner } from "./bannerModel";
import { PrismaClient } from "@/generated/prisma/client";

export class BannerRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll(): Promise<Banner[]> {
        const rows = await this.prisma.$queryRaw`SELECT banner_image, banner_name, "description" FROM "Banner"`;
        return rows as Banner[];
    }
}