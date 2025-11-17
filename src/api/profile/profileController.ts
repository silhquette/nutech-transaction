import type { Request, RequestHandler, Response } from "express";

import { profileService } from "@/api/profile/profileService";
import { AuthRequest } from "@/common/middleware/authMiddleware";

class ProfileController {
    public getProfile: RequestHandler = async (req: AuthRequest, res: Response) => {
        const email = req.user?.email;
        if (!email) {
            return res.status(401).send({ message: "Token tidak disediakan" });
        }
        const serviceResponse = await profileService.findByEmail(email);
        res.status(serviceResponse.status).send(serviceResponse);
    };
}

export const profileController = new ProfileController();