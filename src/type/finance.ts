export type PaymentStatus = "PAID" | "DEBIT";

export interface CreatePaymentDto {
  storeId: number;
  paymentMonth: number;
  paymentYear: number;
  amount: number;
  owed: number;
  status: PaymentStatus;
  paidAt: string;
  image?: string;
}

export interface GetPaymentsParams {
  status?: PaymentStatus;
  paymentMonth?: number;
  paymentYear?: number;
  storeId?: number;
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreatePaymentNotificationDto {
  title: string;
  message: string;
  paymentMonth: number;
  paymentYear: number;
  expired: string;
}
