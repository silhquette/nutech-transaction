import type { User } from "@/api/user/userModel";
import { PrismaClient } from "@prisma/client";

export class AuthRepository {
	private prisma: PrismaClient;

	constructor() {
		this.prisma = new PrismaClient();
	}

	async findByEmail(email: string): Promise<User | null> {
		const row = await this.prisma.user.findUnique({ where: { email } });
		if (!row) return null;
		return row as User;
	}

	async create(payload: Omit<User, "id" | "createdAt" | "updatedAt" | "deletedAt">): Promise<User> {
		const created = await this.prisma.user.create({ data: payload });
		return created as User;
	}

	async update(id: string, data: Partial<Omit<User, "id" | "createdAt" | "updatedAt" | "deletedAt">>): Promise<User | null> {
		try {
			const updated = await this.prisma.user.update({ where: { id, deletedAt: null }, data });
			return updated as User;
		} catch {
			return null;
		}
	}
}