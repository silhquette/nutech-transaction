import { StatusCodes } from "http-status-codes";

import type { User } from "@/api/user/userModel";
import { UserRepository } from "@/api/user/userRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { PasswordUtils } from "@/common/utils/password";

export class UserService {
	private userRepository: UserRepository;

	constructor(repository: UserRepository = new UserRepository()) {
		this.userRepository = repository;
	}

	// Retrieves all users from the database
	async findAll(): Promise<ServiceResponse<User[] | null>> {
		try {
			const users = await this.userRepository.findAll();
			if (!users || users.length === 0) {
				return ServiceResponse.failure("No Users found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<User[]>("Users found", users);
		} catch (ex) {
			const errorMessage = `Error finding all users: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while retrieving users.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	// Retrieves a single user by their ID
	async findById(id: string): Promise<ServiceResponse<User | null>> {
		try {
			const user = await this.userRepository.findById(id);
			if (!user) {
				return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<User>("User found", user);
		} catch (ex) {
			const errorMessage = `Error finding user with id ${id}: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while finding user.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	// Creates a new user
	async create(payload: Omit<User, "id" | "createdAt" | "updatedAt" | "deletedAt">): Promise<ServiceResponse<Omit<User, 'password'> | null>> {
		try {
			// Validasi input sederhana
			if (!payload.email || !payload.password) {
				return ServiceResponse.failure("Email and password are required", null, StatusCodes.BAD_REQUEST);
			}
			if (payload.password.length < 8) {
				return ServiceResponse.failure("Password must be at least 8 characters", null, StatusCodes.BAD_REQUEST);
			}

			// Cek email unique
			const existingUser = await this.userRepository.findByEmail(payload.email);  // Kita butuh tambah method findByEmail di repo, lihat catatan di bawah
			if (existingUser) {
				return ServiceResponse.failure("Email already in use", null, StatusCodes.CONFLICT);
			}

			// Hash password
			const hashedPassword = await PasswordUtils.hash(payload.password);

			// Create user tanpa password asli
			const userPayload = {
				...payload,
				password: hashedPassword,
			};
			const createdUser = await this.userRepository.create(userPayload);

			// Return tanpa password
			const { password, ...userWithoutPassword } = createdUser;
			return ServiceResponse.success<Omit<User, 'password'>>("User registered successfully", userWithoutPassword, StatusCodes.CREATED);
		} catch (ex) {
			const errorMessage = `Error registering user: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while registering user.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	// Updates an existing user
	async update(id: string, data: Partial<Omit<User, "id" | "createdAt" | "updatedAt" | "deletedAt">>): Promise<ServiceResponse<User | null>> {
		try {
			const user = await this.userRepository.update(id, data);
			if (!user) {
				return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<User>("User updated successfully", user);
		} catch (ex) {
			const errorMessage = `Error updating user with id ${id}: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while updating user.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	// Soft deletes a user (sets deletedAt timestamp)
	async softDelete(id: string): Promise<ServiceResponse<User | null>> {
		try {
			const user = await this.userRepository.softDelete(id);
			if (!user) {
				return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<User>("User deleted successfully", user);
		} catch (ex) {
			const errorMessage = `Error deleting user with id ${id}: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while deleting user.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	// Hard deletes a user (permanently removes from database)
	async hardDelete(id: string): Promise<ServiceResponse<null>> {
		try {
			await this.userRepository.hardDelete(id);
			return ServiceResponse.success<null>("User permanently deleted", null);
		} catch (ex) {
			const errorMessage = `Error permanently deleting user with id ${id}: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while permanently deleting user.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}

export const userService = new UserService();