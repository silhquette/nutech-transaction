import type { Request, RequestHandler, Response } from "express";
import { authService } from "@/api/auth/authService";
import type { RegisterInput, LoginInput } from "@/api/auth/authModel";

class AuthController {
	public register: RequestHandler = async (req: Request, res: Response) => {
		const body = req.body as RegisterInput;
		const serviceResponse = await authService.register(body);
		res.status(serviceResponse.status).send(serviceResponse);
	};

	public login: RequestHandler = async (req: Request, res: Response) => {
		const body = req.body as LoginInput;
		const serviceResponse = await authService.login(body);
		res.status(serviceResponse.status).send(serviceResponse);
	};
}

export const authController = new AuthController();