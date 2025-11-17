import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { GetUserSchema, UserSchema, CreateUserSchema, UpdateUserSchema } from "@/api/user/userModel";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "./userController";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);

// GET /users - Get all users
userRegistry.registerPath({
	method: "get",
	path: "/users",
	tags: ["User"],
	responses: createApiResponse(z.array(UserSchema), "Success"),
});
userRouter.get("/", userController.getUsers);

// GET /users/:id - Get user by ID
userRegistry.registerPath({
	method: "get",
	path: "/users/{id}",
	tags: ["User"],
	request: { params: GetUserSchema.shape.params },
	responses: createApiResponse(UserSchema, "Success"),
});
userRouter.get("/:id", validateRequest(GetUserSchema), userController.getUser);

// POST /users - Create new user
userRegistry.registerPath({
	method: "post",
	path: "/users",
	tags: ["User"],
	request: { body: { content: { "application/json": { schema: CreateUserSchema } } } },
	responses: createApiResponse(UserSchema, "Success"),
});
userRouter.post("/", validateRequest(z.object({ body: CreateUserSchema })), userController.createUser);

// PUT /users/:id - Update user
userRegistry.registerPath({
	method: "put",
	path: "/users/{id}",
	tags: ["User"],
	request: { 
		params: GetUserSchema.shape.params,
		body: { content: { "application/json": { schema: UpdateUserSchema } } }
	},
	responses: createApiResponse(UserSchema, "Success"),
});
userRouter.put("/:id", validateRequest(z.object({ params: GetUserSchema.shape.params, body: UpdateUserSchema })), userController.updateUser);

// DELETE /users/:id - Soft delete user
userRegistry.registerPath({
	method: "delete",
	path: "/users/{id}",
	tags: ["User"],
	request: { params: GetUserSchema.shape.params },
	responses: createApiResponse(UserSchema, "Success"),
});
userRouter.delete("/:id", validateRequest(GetUserSchema), userController.deleteUser);