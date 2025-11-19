import express, { type Router } from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { transactionController } from "./transactionController";
import { 
    TopupSchema, 
    PaymentSchema, 
    TransactionSchema, 
    HistorySchema 
} from "./transactionModel";
import { z } from "zod";
import { authMiddleware } from "@/common/middleware/authMiddleware";

export const transactionRegistry = new OpenAPIRegistry();
export const transactionRouter: Router = express.Router();

transactionRegistry.register("Topup", TopupSchema);
transactionRegistry.register("Payment", PaymentSchema);
transactionRegistry.register("Transaction", TransactionSchema);
transactionRegistry.register("History", HistorySchema);

// GET /balance - Get user balance
transactionRegistry.registerPath({
    method: "get",
    path: "/balance",
    tags: ["Transaction"],
    responses: createApiResponse(
        z.object({ balance: z.number() }),
        "Success"
    ),
});
transactionRouter.get("/balance", authMiddleware, transactionController.getBalance);

// POST /topup - Topup balance
transactionRegistry.registerPath({
    method: "post",
    path: "/topup",
    tags: ["Transaction"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: TopupSchema,
                },
            },
        },
    },
    responses: createApiResponse(TransactionSchema, "Success"),
});
transactionRouter.post("/topup", authMiddleware, transactionController.topup);

// POST /transaction - Create payment transaction
transactionRegistry.registerPath({
    method: "post",
    path: "/transaction",
    tags: ["Transaction"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: PaymentSchema,
                },
            },
        },
    },
    responses: createApiResponse(TransactionSchema, "Success"),
});
transactionRouter.post("/transaction", authMiddleware, transactionController.payment);

// GET /transaction/history - Get transaction history
transactionRegistry.registerPath({
    method: "get",
    path: "/transaction/history",
    tags: ["Transaction"],
    request: {
        query: z.object({
            offset: z.string().optional(),
            limit: z.string().optional(),
        }),
    },
    responses: createApiResponse(
        z.object({
            offset: z.number(),
            limit: z.number(),
            records: z.array(HistorySchema),
        }),
        "Success"
    ),
});
transactionRouter.get("/transaction/history", authMiddleware, transactionController.getHistory);