import type { Request, RequestHandler, Response } from "express";

import { profileService } from "@/api/profile/profileService";
import { AuthRequest } from "@/common/middleware/authMiddleware";
import { AuthServiceResponse } from "@/common/models/authServiceResponse";
import { StatusCodes } from "http-status-codes";

class ProfileController {
    public getProfile: RequestHandler = async (req: AuthRequest, res: Response) => {
        const email = req.user?.email;
        if (!email) {
            return res.status(401).send({ message: "Token tidak disediakan" });
        }
        const serviceResponse = await profileService.findByEmail(email);
        res.status(serviceResponse.status).send(serviceResponse);
    };

    public updateProfile: RequestHandler = async (req: AuthRequest, res: Response) => {
        const email = req.user?.email;
        if (!email) {
            return res.status(401).send({ message: "Token tidak disediakan" });
        }
        const body = req.body;
        const serviceResponse = await profileService.update(email, body);
        res.status(serviceResponse.status).send(serviceResponse);
    }

    public uploadProfileImage: RequestHandler = async (req: AuthRequest, res: Response) => {
		const userId = req.user?.userId;
		if (!userId) {
            return res.status(401).send({ message: "Token tidak disediakan" });
		} else if (!req.file) { 
            return res.status(404).send(AuthServiceResponse.failure("File tidak ditemukan", null, StatusCodes.NOT_FOUND));
		}
		const serviceResponse = await profileService.uploadProfileImage(userId, req.file);
		res.status(serviceResponse.status).send(serviceResponse);
	};
}

export const profileController = new ProfileController();