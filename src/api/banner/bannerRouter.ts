import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { bannerController } from "@/api/banner/bannerController";
import { BannerSchema } from "@/api/banner/bannerModel";
import z from "zod";

export const bannerRegistry = new OpenAPIRegistry();
export const bannerRouter: Router = express.Router();

bannerRegistry.register("Banner", BannerSchema);

// GET /banners - Get all banners
bannerRegistry.registerPath({
    method: "get",
    path: "/banner",
    tags: ["Banner"],
    responses: createApiResponse(z.array(BannerSchema), "Success"),
});
bannerRouter.get("/", bannerController.getBanners);