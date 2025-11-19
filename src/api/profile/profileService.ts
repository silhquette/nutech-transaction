import { StatusCodes } from "http-status-codes";

import { Profile, ProfileImageResponse } from './profileModel';
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

	// Updates an existing user
	async update(id: string, data: Partial<Profile>): Promise<AuthServiceResponse<Profile | null>> {
		try {
			const user = await this.profileRepository.update(id, data);
			if (!user) {
				return AuthServiceResponse.failure("Profile not found", null, StatusCodes.NOT_FOUND);
			}
			return AuthServiceResponse.success<Profile>("Profile updated successfully", user);
		} catch (ex) {
			const errorMessage = `Error updating user with id ${id}: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return AuthServiceResponse.failure(
				"An error occurred while updating user.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async uploadProfileImage(
		userId: string,
		file: Express.Multer.File,
	): Promise<AuthServiceResponse<ProfileImageResponse | null>> {
		try {
			// Simulate async upload to object storage (e.g., AWS S3, GCS, etc.)
			await this.simulateFileUpload(file);

			// Generate fake URL for the uploaded image
			const timestamp = Date.now();
			const fileExtension = file.mimetype === "image/png" ? "png" : "jpeg";
			const fakeImageUrl = `https://yoururlapi.com/uploads/profile-${userId}-${timestamp}.${fileExtension}`;

			// Update database with the fake URL
			const updatedProfile = await this.profileRepository.updateProfileImage(
				userId,
				fakeImageUrl,
			);

			if (!updatedProfile) {
				return AuthServiceResponse.failure(
					"User tidak ditemukan",
					null,
					StatusCodes.NOT_FOUND,
				);
			}

			// Format response according to API spec
			const response: ProfileImageResponse = {
				email: updatedProfile.email,
				first_name: updatedProfile.first_name,
				last_name: updatedProfile.last_name,
				profile_image: fakeImageUrl,
			};

			return AuthServiceResponse.success("Update Profile Image berhasil", response);
		} catch (ex) {
			const errorMessage = `Error uploading profile image: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return AuthServiceResponse.failure(
				"Terjadi kesalahan saat upload profile image",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	// Simulate file upload delay (fake async process)
	private async simulateFileUpload(file: Express.Multer.File): Promise<void> {
		return new Promise((resolve) => {
			// Simulate upload time based on file size (100-500ms)
			const uploadTime = Math.floor(Math.random() * 400) + 100;
			setTimeout(() => {
				logger.info(
					`Simulated upload: ${file.originalname} (${file.size} bytes) - took ${uploadTime}ms`,
				);
				resolve();
			}, uploadTime);
		});
	}
}

export const profileService = new ProfileService();