import instance from "@/utils/axios";
import {
  CreatePaymentDto,
  GetPaymentsParams,
  CreatePaymentNotificationDto,
} from "@/type/finance";

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

export const getStorePaymentHistory = async (storeId: number) => {
  const res = await instance.get(`/api/v1/finance/stores/${storeId}/payments`);
  return res.data;
};

export const createPaymentNotification = async (
  payload: CreatePaymentNotificationDto,
) => {
  const res = await instance.post("/api/v1/finance/notifications", payload);
  return res.data;
};
