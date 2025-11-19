import { PrismaClient } from "@prisma/client";
import type { Transaction, History } from "./transactionModel";

export class TransactionRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    // Generate invoice number
    async generateInvoiceNumber(): Promise<string> {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
        
        const result = await this.prisma.$queryRaw<{ count: bigint }[]>`
            SELECT COUNT(*) as count 
            FROM "Transaction" 
            WHERE "createdAt"::date = CURRENT_DATE
        `;
        
        const count = Number(result[0].count) + 1;
        const paddedCount = count.toString().padStart(3, '0');
        
        return `INV${dateStr}-${paddedCount}`;
    }

    // Get user balance
    async getUserBalance(userId: string): Promise<number> {
        const result = await this.prisma.$queryRaw<{ balance: number }[]>`
            SELECT balance 
            FROM "User" 
            WHERE id = ${userId} 
            AND "deletedAt" IS NULL
        `;
        
        return result[0]?.balance || 0;
    }

    // Update user balance
    async updateUserBalance(userId: string, newBalance: number): Promise<void> {
        await this.prisma.$executeRaw`
            UPDATE "User" 
            SET balance = ${newBalance}, "updatedAt" = NOW() 
            WHERE id = ${userId}
        `;
    }

    // Create topup transaction
    async createTopup(userId: string, amount: number, invoiceNumber: string): Promise<void> {
        await this.prisma.$executeRaw`
            INSERT INTO "Transaction" 
            (id, "userId", "invoiceNumber", type, description, amount, "createdAt")
            VALUES (
                gen_random_uuid()::text,
                ${userId},
                ${invoiceNumber},
                'TOPUP'::"TransactionType",
                'Top Up balance',
                ${amount},
                NOW()
            )
        `;
    }

    // Get service by code
    async getServiceByCode(serviceCode: string): Promise<{
        id: string;
        service_code: string;
        service_name: string;
        service_tarif: number;
    } | null> {
        const result = await this.prisma.$queryRaw<Array<{
            id: string;
            service_code: string;
            service_name: string;
            service_tarif: number;
        }>>`
            SELECT id, service_code, service_name, service_tarif 
            FROM "Service" 
            WHERE service_code = ${serviceCode} 
            AND "deletedAt" IS NULL
        `;
        
        return result[0] || null;
    }

    // Create payment transaction
    async createPayment(
        userId: string,
        serviceId: string,
        serviceName: string,
        amount: number,
        invoiceNumber: string
    ): Promise<void> {
        await this.prisma.$executeRaw`
            INSERT INTO "Transaction" 
            (id, "userId", "serviceId", "invoiceNumber", type, description, amount, "createdAt")
            VALUES (
                gen_random_uuid()::text,
                ${userId},
                ${serviceId},
                ${invoiceNumber},
                'PAYMENT'::"TransactionType",
                ${serviceName},
                ${amount},
                NOW()
            )
        `;
    }

    // Get transaction by invoice number
    async getTransactionByInvoice(invoiceNumber: string): Promise<Transaction | null> {
        const result = await this.prisma.$queryRaw<Array<{
            invoice_number: string;
            service_code: string | null;
            service_name: string | null;
            transaction_type: string;
            total_amount: number;
            created_on: Date;
        }>>`
            SELECT 
                t."invoiceNumber" as invoice_number,
                s.service_code,
                s.service_name,
                t.type::text as transaction_type,
                t.amount as total_amount,
                t."createdAt" as created_on
            FROM "Transaction" t
            LEFT JOIN "Service" s ON t."serviceId" = s.id
            WHERE t."invoiceNumber" = ${invoiceNumber}
            AND t."deletedAt" IS NULL
        `;
        
        if (!result[0]) return null;
        
        return {
            invoice_number: result[0].invoice_number,
            service_code: result[0].service_code,
            service_name: result[0].service_name,
            transaction_type: result[0].transaction_type as "TOPUP" | "PAYMENT",
            total_amount: result[0].total_amount,
            created_on: result[0].created_on.toISOString(),
        };
    }

    async getTransactionHistory(
        userId: string,
        offset: number = 0,
        limit?: number
    ): Promise<History[]> {
        const limitClause = limit ? `LIMIT ${limit}` : '';
        
        const result = await this.prisma.$queryRawUnsafe<Array<{
            invoice_number: string;
            transaction_type: string;
            description: string | null;
            total_amount: number;
            created_on: Date;
        }>>(
            `
            SELECT 
                "invoiceNumber" as invoice_number,
                type::text as transaction_type,
                description,
                amount as total_amount,
                "createdAt" as created_on
            FROM "Transaction"
            WHERE "userId" = $1
            AND "deletedAt" IS NULL
            ORDER BY "createdAt" DESC
            OFFSET $2
            ${limitClause}
            `,
            userId,
            offset
        );
        
        return result.map((row) => ({
            invoice_number: row.invoice_number,
            transaction_type: row.transaction_type as "TOPUP" | "PAYMENT",
            description: row.description,
            total_amount: row.total_amount,
            created_on: row.created_on.toISOString(),
        }));
    }
}