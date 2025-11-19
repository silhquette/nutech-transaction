import { z } from "zod";

export const TopupSchema = z.object({
  top_up_amount: z.number({
            required_error: "Paramter amount tidak sesuai format",
            invalid_type_error: "Paramter amount tidak sesuai format",
        }).positive("Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0"),
});

export const PaymentSchema = z.object({
  service_code: z.string().min(1, "Service code tidak sesuai format"),
});

export const TransactionSchema = z.object({
  invoice_number: z.string(),
  service_code: z.string().nullable(),
  service_name: z.string().nullable(),
  transaction_type: z.enum(["TOPUP", "PAYMENT"]),
  total_amount: z.number().positive(),
  created_on: z.string(),
});

export const HistorySchema = z.object({
  invoice_number: z.string(),
  transaction_type: z.enum(["TOPUP", "PAYMENT"]),
  description: z.string().nullable(),
  total_amount: z.number().positive(),
  created_on: z.string(),
});

export type TopupInput = z.infer<typeof TopupSchema>;
export type PaymentInput = z.infer<typeof PaymentSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type History = z.infer<typeof HistorySchema>;