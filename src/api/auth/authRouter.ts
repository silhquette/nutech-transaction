import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { RegisterSchema, LoginSchema } from "@/api/auth/authModel";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { authController } from "@/api/auth/authController";
import { UserSchema } from "@/api/user/userModel";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

// POST /registration - Register new user
authRegistry.registerPath({
	method: "post",
	path: "/registration",
	tags: ["Auth"],
	request: { body: { content: { "application/json": { schema: RegisterSchema } } } },
	responses: createApiResponse(UserSchema, "Success"),
});
authRouter.post("/registration", validateRequest(z.object({ body: RegisterSchema })), authController.register);

// POST /login - Login user
authRegistry.registerPath({
	method: "post",
	path: "/login",
	tags: ["Auth"],
	request: { body: { content: { "application/json": { schema: LoginSchema } } } },
	responses: createApiResponse(z.object({ token: z.string(), user: UserSchema }), "Success"),
});
authRouter.post("/login", validateRequest(z.object({ body: LoginSchema })), authController.login);