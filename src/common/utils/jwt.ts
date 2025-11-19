import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "@/common/utils/envConfig";

export interface JwtPayload {
	userId: string;
	email: string;
}

export class JwtUtils {
	/**
	 * Generate JWT token
	 */
	static generateToken(payload: JwtPayload): string {
		const options: SignOptions = {
			expiresIn: env.JWT_EXPIRES_IN as any,
		};
		
		return jwt.sign(payload, env.JWT_SECRET, options);
	}

	/**
	 * Verify dan decode JWT token
	 */
	static verifyToken(token: string): JwtPayload {
		return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
	}
}