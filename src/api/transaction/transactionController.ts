import type { Request, RequestHandler, Response } from "express";
import { transactionService } from "./transactionService";
import { TopupSchema, PaymentSchema, PaymentInput } from "./transactionModel";
import { AuthRequest } from "@/common/middleware/authMiddleware";

class TransactionController {
    // Get balance
    public getBalance: RequestHandler = async (req: AuthRequest, res: Response) => {
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).send({
                status: 401,
                message: "Unauthorized",
                data: null,
            });
        }

        const serviceResponse = await transactionService.getBalance(userId);
        res.status(serviceResponse.status).send(serviceResponse);
    };

    // Topup
    public topup: RequestHandler = async (req: AuthRequest, res: Response) => {
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).send({
                status: 401,
                message: "Unauthorized",
                data: null,
            });
        }

        // Validate request body
        const validation = TopupSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).send({
                status: 400,
                message: "Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
                data: null,
            });
        }

        const serviceResponse = await transactionService.topup(userId, validation.data);
        res.status(serviceResponse.status).send(serviceResponse);
    };

    // Payment
    public payment: RequestHandler = async (req: AuthRequest, res: Response) => {
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).send({
                status: 401,
                message: "Unauthorized",
                data: null,
            });
        }

        const body = req.body as PaymentInput;
        const serviceResponse = await transactionService.payment(userId, body);
        res.status(serviceResponse.status).send(serviceResponse);
    };

    // Get history
    public getHistory: RequestHandler = async (req: AuthRequest, res: Response) => {
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).send({
                status: 401,
                message: "Unauthorized",
                data: null,
            });
        }

        const offset = parseInt(req.query.offset as string) || 0;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

        const serviceResponse = await transactionService.getHistory(userId, offset, limit);
        res.status(serviceResponse.status).send(serviceResponse);
    };
}

export const transactionController = new TransactionController();