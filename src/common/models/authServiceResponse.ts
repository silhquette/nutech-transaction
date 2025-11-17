import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export class AuthServiceResponse<T = null> {
	readonly status: number;
	readonly message: string;
	readonly data: T;

	private constructor(status: number, message: string, data: T) {
		this.status = status;
		this.message = message;
		this.data = data;
	}

	static success<T>(message: string, data: T = null as T, status: number = StatusCodes.OK) {
		return new AuthServiceResponse(status, message, data);
	}

	static failure<T>(message: string, data: T = null as T, status: number = StatusCodes.BAD_REQUEST) {
		return new AuthServiceResponse(status, message, data);
	}
}

export const AuthServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		status: z.number(),
		message: z.string(),
		data: dataSchema.nullable(),
	});