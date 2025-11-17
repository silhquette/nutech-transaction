import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export class PasswordUtils {
	/**
	 * Hash password menggunakan bcrypt
	 */
	static async hash(password: string): Promise<string> {
		return bcrypt.hash(password, SALT_ROUNDS);
	}

	/**
	 * Verify password dengan hash
	 */
	static async verify(password: string, hash: string): Promise<boolean> {
		return bcrypt.compare(password, hash);
	}
}