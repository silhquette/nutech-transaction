import { StatusCodes } from "http-status-codes";

import { Service } from './serviceModel';
import { ServiceRepository } from "@/api/service/serviceRepository";
import { AuthServiceResponse } from '@/common/models/authServiceResponse';
import { logger } from "@/server";

export class ServiceService {
	private serviceRepository: ServiceRepository;

	constructor(repository: ServiceRepository = new ServiceRepository()) {
		this.serviceRepository = repository;
	}

	// Retrieves all users from the database
	async findAll(): Promise<AuthServiceResponse<Service[] | null>> {
		try {
			const users = await this.serviceRepository.findAll();
			if (!users || users.length === 0) {
				return AuthServiceResponse.failure("Tidak ada Service ditemukan", null, StatusCodes.NOT_FOUND);
			}
			return AuthServiceResponse.success<Service[]>("Sukses", users);
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

export const serviceService = new ServiceService();