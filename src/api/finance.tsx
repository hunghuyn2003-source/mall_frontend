import instance from "@/utils/axios";

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
}

export const createPayment = async (payload: CreatePaymentDto) => {
  const res = await instance.post("/api/v1/finance/payments", payload);
  return res.data;
};

export const getPayments = async (params?: GetPaymentsParams) => {
  const res = await instance.get("/api/v1/finance/payments", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
      status: params?.status,
      paymentMonth: params?.paymentMonth,
      paymentYear: params?.paymentYear,
      storeId: params?.storeId,
      search: params?.search,
    },
  });
  return res.data;
};

export const createPaymentNotification = async (
  payload: CreatePaymentNotificationDto,
) => {
  const res = await instance.post("/api/v1/finance/notifications", payload);
  return res.data;
};
