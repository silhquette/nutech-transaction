import { Service } from "./serviceModel";
import { PrismaClient } from "@/generated/prisma/client";

export class ServiceRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll(): Promise<Service[]> {
        const rows = await this.prisma.$queryRaw`SELECT "service_code", "service_name", "service_icon", "service_tarif" FROM "Service"`;
        return rows as Service[];
    }
}