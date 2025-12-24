import instance from "@/utils/axios";

export const listStaff = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  storeId?: number;
}) => {
  const res = await instance.get("/api/v1/staffs", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      search: params?.search,
      storeId: params?.storeId,
    },
  });
  return res.data;
};

export const getStaff = async (id: number) => {
  const res = await instance.get(`/api/v1/staffs/${id}`);
  return res.data;
};

export const createStaff = async (payload: any) => {
  const res = await instance.post("/api/v1/staffs", payload);
  return res.data;
};

export const updateStaff = async (id: number, payload: any) => {
  const res = await instance.patch(`/api/v1/staffs/${id}`, payload);
  return res.data;
};
