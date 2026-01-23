import instance from "@/utils/axios";

export const listStoreInvoices = async (
  storeId: number,
  params?: {
    page?: number;
    limit?: number;
  },
) => {
  const res = await instance.get(`/api/v1/store-owner/invoices/${storeId}`, {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
    },
  });
  return res.data;
};

export const getInvoiceDetail = async (storeId: number, invoiceId: number) => {
  const res = await instance.get(
    `/api/v1/store-owner/invoices/${storeId}/${invoiceId}/detail`,
  );
  return res.data;
};

export const payInvoice = async (storeId: number, invoiceId: number) => {
  const res = await instance.patch(
    `/api/v1/store-owner/invoices/${storeId}/${invoiceId}/pay`,
  );
  return res.data;
};

export const createStoreInvoice = async (payload: {
  storeId: number;
  monthYear: string;
  contractFee?: number;
  electricityFee?: number;
  waterFee?: number;
  dueDate?: string;
  note?: string;
}) => {
  const res = await instance.post("/api/v1/store-owner/invoices", payload);
  return res.data;
};
