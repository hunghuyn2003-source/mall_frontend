import instance from "@/utils/axios";

export const listRental = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const res = await instance.get("/api/v1/rentals", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      search: params?.search,
    },
  });
  return res.data;
};

export const getRental = async (id: number) => {
  const res = await instance.get(`/api/v1/rentals/${id}`);
  return res.data;
};

export const updateRental = async (id: number, payload: any) => {
  const res = await instance.patch(`/api/v1/rentals/${id}`, payload);
  return res.data;
};
