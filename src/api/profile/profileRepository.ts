import { Profile, ProfileImageResponse } from "./profileModel";
import { PrismaClient } from "@prisma/client";

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
            first_name: row.first_name,
            last_name: row.last_name,
            profile_image: row.profile_image,
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

    async updateProfileImage(userId: string, imageUrl: string): Promise<Profile | null> {
		const result: Array<ProfileImageResponse> = await this.prisma.$queryRaw`
			UPDATE "User"
			SET "profile_image" = ${imageUrl}, "updatedAt" = NOW()
			WHERE id = ${userId}
			AND "deletedAt" IS NULL
			RETURNING email, "first_name", "last_name", "profile_image"
		`;

		if (!result || result.length === 0) return null;

		return {
			email: result[0].email,
			first_name: result[0].first_name,
			last_name: result[0].last_name,
			profile_image: result[0].profile_image,
		};
	}
}