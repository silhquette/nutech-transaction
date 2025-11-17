import { StatusCodes } from "http-status-codes";
import { PasswordUtils } from "@/common/utils/password";
import { JwtUtils, type JwtPayload } from "@/common/utils/jwt";

import type { User } from "@/api/user/userModel";
import { AuthRepository } from "@/api/auth/authRepository";
import { AuthServiceResponse } from "@/common/models/authServiceResponse";
import { logger } from "@/server";

export class AuthService {
	private authRepository: AuthRepository;

	constructor(repository: AuthRepository = new AuthRepository()) {
		this.authRepository = repository;
	}

	async register(payload: Omit<User, "id" | "createdAt" | "updatedAt" | "deletedAt">): Promise<AuthServiceResponse<Omit<User, 'password'> | null>> {
		try {
			if (!payload.email || !payload.password) {
				return AuthServiceResponse.failure("Email and password are required", null, StatusCodes.BAD_REQUEST);
			}
			if (payload.password.length < 8) {
				return AuthServiceResponse.failure("Password must be at least 8 characters", null, StatusCodes.BAD_REQUEST);
			}

			const existingUser = await this.authRepository.findByEmail(payload.email);
			if (existingUser) {
				return AuthServiceResponse.failure("Email already in use", null, StatusCodes.CONFLICT);
			}

			const hashedPassword = await PasswordUtils.hash(payload.password);

			const userPayload = {
				...payload,
				password: hashedPassword,
			};
			const createdUser = await this.authRepository.create(userPayload);

			const { password, ...userWithoutPassword } = createdUser;
			return AuthServiceResponse.success<Omit<User, 'password'>>("Registrasi berhasil silahkan login", userWithoutPassword, StatusCodes.CREATED);
		} catch (ex) {
			const errorMessage = `Error registering user: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return AuthServiceResponse.failure(
				"An error occurred while registering user.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async login(payload: { email: string; password: string }): Promise<AuthServiceResponse<{ token: string; user: Omit<User, 'password'> } | null>> {
		try {
			if (!payload.email || !payload.password) {
				return AuthServiceResponse.failure("Email and password are required", null, StatusCodes.BAD_REQUEST);
			}

			const user = await this.authRepository.findByEmail(payload.email);
			if (!user) {
				return AuthServiceResponse.failure("Username atau password salah", null, StatusCodes.UNAUTHORIZED);
			}

			const isPasswordValid = await PasswordUtils.verify(payload.password, user.password);
			if (!isPasswordValid) {
				return AuthServiceResponse.failure("Username atau password salah", null, StatusCodes.UNAUTHORIZED);
			}

			const jwtPayload: JwtPayload = { userId: user.id, email: user.email };
			const token = JwtUtils.generateToken(jwtPayload);

			const { password, ...userWithoutPassword } = user;
			return AuthServiceResponse.success<{ token: string; user: Omit<User, 'password'> }>("Login successful", { token, user: userWithoutPassword });
		} catch (ex) {
			const errorMessage = `Error during login: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return AuthServiceResponse.failure(
				"An error occurred while logging in.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}

export const authService = new AuthService();