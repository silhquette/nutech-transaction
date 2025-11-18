import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { serviceController } from "@/api/service/serviceController";
import { ServiceSchema } from "@/api/service/serviceModel";
import z from "zod";
import { authMiddleware } from "@/common/middleware/authMiddleware";

export const serviceRegistry = new OpenAPIRegistry();
export const serviceRouter: Router = express.Router();

serviceRegistry.register("Service", ServiceSchema);

// GET /services - Get all services
serviceRegistry.registerPath({
    method: "get",
    path: "/service",
    tags: ["Service"],
    responses: createApiResponse(z.array(ServiceSchema), "Success"),
});
serviceRouter.get("/", authMiddleware, serviceController.getServices);