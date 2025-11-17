import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/userService";
import type { CreateUserInput, UpdateUserInput } from "@/api/user/userModel";

class UserController {
	public getUsers: RequestHandler = async (_req: Request, res: Response) => {
		const serviceResponse = await userService.findAll();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getUser: RequestHandler = async (req: Request, res: Response) => {
		const id = req.params.id as string;
		const serviceResponse = await userService.findById(id);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public createUser: RequestHandler = async (req: Request, res: Response) => {
		const body = req.body as CreateUserInput;
		const serviceResponse = await userService.register(body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public updateUser: RequestHandler = async (req: Request, res: Response) => {
		const id = req.params.id as string;
		const body = req.body as UpdateUserInput;
		const serviceResponse = await userService.update(id, body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public deleteUser: RequestHandler = async (req: Request, res: Response) => {
		const id = req.params.id as string;
		const serviceResponse = await userService.softDelete(id);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const userController = new UserController();