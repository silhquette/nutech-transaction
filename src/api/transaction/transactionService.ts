import { StatusCodes } from "http-status-codes";
import { TransactionRepository } from "./transactionRepository";
import { AuthServiceResponse } from "@/common/models/authServiceResponse";
import type { Transaction, History, TopupInput, PaymentInput } from "./transactionModel";
import { logger } from "@/server";

export class TransactionService {
    private transactionRepository: TransactionRepository;

    constructor(repository: TransactionRepository = new TransactionRepository()) {
        this.transactionRepository = repository;
    }

    // Get user balance
    async getBalance(userId: string): Promise<AuthServiceResponse<{ balance: number } | null>> {
        try {
            const balance = await this.transactionRepository.getUserBalance(userId);
            return AuthServiceResponse.success("Get Balance Berhasil", { balance });
        } catch (ex) {
            const errorMessage = `Error getting balance: ${(ex as Error).message}`;
            logger.error(errorMessage);
            return AuthServiceResponse.failure(
                "Terjadi kesalahan saat mengambil balance",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Topup balance
    async topup(userId: string, input: TopupInput): Promise<AuthServiceResponse<{ balance: number } | null>> {
        try {
            // Validate amount
            if (input.top_up_amount <= 0) {
                return AuthServiceResponse.failure(
                    "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }

            // Get current balance
            const currentBalance = await this.transactionRepository.getUserBalance(userId);

            // Generate invoice number
            const invoiceNumber = await this.transactionRepository.generateInvoiceNumber();

            // Create topup transaction
            await this.transactionRepository.createTopup(userId, input.top_up_amount, invoiceNumber);

            // Update user balance
            const newBalance = currentBalance + input.top_up_amount;
            await this.transactionRepository.updateUserBalance(userId, newBalance);

            return AuthServiceResponse.success("Top Up Balance berhasil", {
				"balance": newBalance
			});
        } catch (ex) {
            const errorMessage = `Error during topup: ${(ex as Error).message}`;
            logger.error(errorMessage);
            return AuthServiceResponse.failure(
                "Terjadi kesalahan saat melakukan top up",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Payment transaction
    async payment(userId: string, input: PaymentInput): Promise<AuthServiceResponse<Transaction | null>> {
        try {
            // Get service
            const service = await this.transactionRepository.getServiceByCode(input.service_code);
            if (!service) {
                return AuthServiceResponse.failure(
                    "Service ataus Layanan tidak ditemukan",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }

            // Get current balance
            const currentBalance = await this.transactionRepository.getUserBalance(userId);

            // Check if balance is sufficient
            if (currentBalance < service.service_tarif) {
                return AuthServiceResponse.failure(
                    "Saldo tidak mencukupi",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }

            // Generate invoice number
            const invoiceNumber = await this.transactionRepository.generateInvoiceNumber();

            // Create payment transaction
            await this.transactionRepository.createPayment(
                userId,
                service.id,
                service.service_name,
                service.service_tarif,
                invoiceNumber
            );

            // Update user balance
            const newBalance = currentBalance - service.service_tarif;
            await this.transactionRepository.updateUserBalance(userId, newBalance);

            // Get created transaction
            const transaction = await this.transactionRepository.getTransactionByInvoice(invoiceNumber);

            return AuthServiceResponse.success("Transaksi berhasil", transaction);
        } catch (ex) {
            const errorMessage = `Error during payment: ${(ex as Error).message}`;
            logger.error(errorMessage);
            return AuthServiceResponse.failure(
                "Terjadi kesalahan saat melakukan transaksi",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Get transaction history
    async getHistory(
        userId: string,
        offset: number = 0,
        limit?: number
    ): Promise<AuthServiceResponse<{ offset: number; limit: number; records: History[] } | null>> {
        try {
            const records = await this.transactionRepository.getTransactionHistory(userId, offset, limit);

            return AuthServiceResponse.success("Get History Berhasil", {
                offset,
                limit: limit || records.length,
                records,
            });
        } catch (ex) {
            const errorMessage = `Error getting history: ${(ex as Error).message}`;
            logger.error(errorMessage);
            return AuthServiceResponse.failure(
                "Terjadi kesalahan saat mengambil history transaksi",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
}

export const transactionService = new TransactionService();