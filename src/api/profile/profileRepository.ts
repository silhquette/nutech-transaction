import { Profile } from "./profileModel";
import { PrismaClient } from "@/generated/prisma/client";

export class ProfileRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findByEmail(email: string): Promise<Profile | null> {
        const row = await this.prisma.user.findUnique({ where: { email } });
        if (!row) return null;
        return {
            email: row.email,
            firstName: row.firstName,
            lastName: row.lastName,
            profileImage: row.profileImage,
        } as Profile;
    }
    
    async update(email: string, data: Partial<Profile>): Promise<Profile | null> {
        try {
            const updated = await this.prisma.user.update({ where: { email, deletedAt: null }, data });
            return updated as Profile;
        } catch {
            return null;
        }
    }
}