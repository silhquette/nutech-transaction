import { AuthServiceResponse } from './../models/authServiceResponse';
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { ZodError, ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
	try {
		await schema.parseAsync({ body: req.body, query: req.query, params: req.params });
		next();
	} catch (err) {
		const errors = (err as ZodError).errors.map((e) => e.message);

		const errorMessage =
			errors.length === 1
				? errors[0]
				: `${errors.join("; ")}`;

		const statusCode = StatusCodes.BAD_REQUEST;
		const serviceResponse = AuthServiceResponse.failure(errorMessage, null, statusCode);
		res.status(serviceResponse.status).send(serviceResponse);
	}
};
