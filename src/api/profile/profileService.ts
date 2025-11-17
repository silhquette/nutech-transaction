import { StatusCodes } from "http-status-codes";

import { Profile } from './profileModel';
import { ProfileRepository } from "./profileRepository";
import { AuthServiceResponse } from '@/common/models/authServiceResponse';
import { logger } from "@/server";

export class ProfileService {
	private profileRepository: ProfileRepository;

	constructor(repository: ProfileRepository = new ProfileRepository()) {
		this.profileRepository = repository;
	}

	// Retrieves a single user by their Email
	async findByEmail(email: string): Promise<AuthServiceResponse<Profile | null>> {
		try {
			const user = await this.profileRepository.findByEmail(email);
			if (!user) {
				return AuthServiceResponse.failure("Profil tidak ditemukan", null, StatusCodes.NOT_FOUND);
			}
			return AuthServiceResponse.success<Profile>("Sukses", user);
		} catch (ex) {
			const errorMessage = `Error finding user with email ${email}: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return AuthServiceResponse.failure(
				"An error occurred while finding user.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}

export const profileService = new ProfileService();