import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { profileController } from "@/api/profile/profileController";
import { ProfileImageResponseSchema, ProfileSchema, UpdateProfileSchema } from "@/api/profile/profileModel";
import { authMiddleware } from "@/common/middleware/authMiddleware";
import { validateRequest } from "@/common/utils/httpHandlers";
import z from "zod";

export const profileRegistry = new OpenAPIRegistry();
export const profileRouter: Router = express.Router();

profileRegistry.register("Profile", ProfileSchema);

// GET /profile - Get user's profile
profileRegistry.registerPath({
    method: "get",
    path: "/profile",
    tags: ["Profile"],
    responses: createApiResponse(ProfileSchema, "Success"),
});
profileRouter.get("/", authMiddleware, profileController.getProfile);

// PUT /profile/update - Update profile
profileRegistry.registerPath({
    method: "put",
    path: "/profile/update",
    tags: ["Profile"],
    request: { 
        body: { content: { "application/json": { schema: UpdateProfileSchema } } }
    },
    responses: createApiResponse(ProfileSchema, "Success"),
});
profileRouter.put("/update", authMiddleware, validateRequest(z.object({ body: UpdateProfileSchema })),profileController.updateProfile);

// PUT /profile/image - Upload profile image
profileRegistry.registerPath({
	method: "put",
	path: "/profile/image",
	tags: ["Profile"],
	request: {
		body: {
			content: {
				"multipart/form-data": {
					schema: {
						type: "object",
						properties: {
							file: {
								type: "string",
								format: "binary",
								description: "Image file (jpeg/png, max 2MB)",
							},
						},
						required: ["file"],
					},
				},
			},
		},
	},
	responses: createApiResponse(ProfileImageResponseSchema, "Success"),
});
profileRouter.put("/image", authMiddleware, profileController.uploadProfileImage);