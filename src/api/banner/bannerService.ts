import { StatusCodes } from "http-status-codes";

import { Banner } from './bannerModel';
import { BannerRepository } from "./bannerRepository";
import { AuthServiceResponse } from '@/common/models/authServiceResponse';
import { logger } from "@/server";

export class BannerService {
	private bannerRepository: BannerRepository;

	constructor(repository: BannerRepository = new BannerRepository()) {
		this.bannerRepository = repository;
	}

	// Retrieves all users from the database
	async findAll(): Promise<AuthServiceResponse<Banner[] | null>> {
		try {
			const users = await this.bannerRepository.findAll();
			if (!users || users.length === 0) {
				return AuthServiceResponse.failure("Tidak ada Banner ditemukan", null, StatusCodes.NOT_FOUND);
			}
			return AuthServiceResponse.success<Banner[]>("Sukses", users);
		} catch (ex) {
			const errorMessage = `Error finding all users: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return AuthServiceResponse.failure(
				"An error occurred while retrieving users.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}

export const bannerService = new BannerService();