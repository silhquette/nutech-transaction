import type { Request, RequestHandler, Response } from "express";

import { serviceService } from "@/api/service/serviceService";

class ServiceController {
    public getServices: RequestHandler = async (_req: Request, res: Response) => {
        const serviceResponse = await serviceService.findAll();
        res.status(serviceResponse.status).send(serviceResponse);
    };
}

export const serviceController = new ServiceController();