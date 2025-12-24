import instance from "@/utils/axios";

export const listProducts = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  storeId?: number;
}) => {
  const res = await instance.get("/api/v1/products", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      search: params?.search,
      storeId: params?.storeId,
    },
  });
  return res.data;
};

export const getProduct = async (id: number) => {
  const res = await instance.get(`/api/v1/products/${id}`);
  return res.data;
};

export const createProduct = async (payload: any) => {
  const res = await instance.post("/api/v1/products", payload);
  return res.data;
};

export const updateProduct = async (id: number, payload: any) => {
  const res = await instance.patch(`/api/v1/products/${id}`, payload);
  return res.data;
};

// Product Category
export const listProductCategories = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  storeId?: number;
}) => {
  const res = await instance.get("/api/v1/products/categories", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      search: params?.search,
      storeId: params?.storeId,
    },
  });
  return res.data;
};

export const getProductCategory = async (id: number) => {
  const res = await instance.get(`/api/v1/products/categories/${id}`);
  return res.data;
};

export const createProductCategory = async (payload: any) => {
  const res = await instance.post("/api/v1/products/categories", payload);
  return res.data;
};

export const updateProductCategory = async (id: number, payload: any) => {
  const res = await instance.patch(
    `/api/v1/products/categories/${id}`,
    payload,
  );
  return res.data;
};

export const deleteProductCategory = async (id: number) => {
  const res = await instance.delete(`/api/v1/products/categories/${id}`);
  return res.data;
};

export const sellPos = async (payload: any) => {
  const res = await instance.post("/api/v1/products/sell", payload);
  return res.data;
};

export const historyInvoice = async (params?: {
  page?: number;
  limit?: number;
  storeId?: number;
}) => {
  const res = await instance.get("/api/v1/products/invoices", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      storeId: params?.storeId,
    },
  });
  return res.data;
};

export const getHistoryInvoice = async (id: number) => {
  const res = await instance.get(`/api/v1/products/invoices/${id}`);
  return res.data;
};
