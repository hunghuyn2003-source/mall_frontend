import instance from "@/utils/axios";

export const createStore = async (payload: any) => {
  const res = await instance.post("/api/v1/stores/create", payload);
  return res.data;
};

export const listStore = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const res = await instance.get("/api/v1/stores", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      search: params?.search,
    },
  });
  return res.data;
};

export const updateStore = async (id: number, payload: any) => {
  const res = await instance.patch(`/api/v1/stores/${id}`, payload);
  return res.data;
};
