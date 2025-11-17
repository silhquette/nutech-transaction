import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { profileController } from "@/api/profile/profileController";
import { ProfileSchema } from "@/api/profile/profileModel";
import { authMiddleware } from "@/common/middleware/authMiddleware";

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