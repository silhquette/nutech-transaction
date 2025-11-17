import { type Request, type Response, type NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtUtils, type JwtPayload } from "@/common/utils/jwt";
import { logger } from "@/server";
import { AuthServiceResponse } from "@/common/models/authServiceResponse";

export interface AuthRequest extends Request {
	user?: JwtPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		const serviceResponse = AuthServiceResponse.failure("Token tidak disediakan", null, StatusCodes.NOT_FOUND)
		return res.status(StatusCodes.UNAUTHORIZED).send(serviceResponse);
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = JwtUtils.verifyToken(token);
		req.user = decoded;
		next();
	} catch (error) {
		logger.error(`Invalid token: ${(error as Error).message}`);
		const serviceResponse = AuthServiceResponse.failure("Token tidak tidak valid atau kadaluwarsa", null, StatusCodes.UNAUTHORIZED)
		return res.status(StatusCodes.UNAUTHORIZED).send(serviceResponse);
	}
};