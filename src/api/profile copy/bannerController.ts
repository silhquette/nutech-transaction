import type { Request, RequestHandler, Response } from "express";

import { bannerService } from "@/api/profile copy/bannerService";

class BannerController {
    public getBanners: RequestHandler = async (_req: Request, res: Response) => {
        const serviceResponse = await bannerService.findAll();
        res.status(serviceResponse.status).send(serviceResponse);
    };
}

export const bannerController = new BannerController();