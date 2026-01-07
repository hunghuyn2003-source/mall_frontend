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

export const getStoreDetail = async (
  id: number,
  params?: {
    membersPage?: number;
    membersLimit?: number;
    productsPage?: number;
    productsLimit?: number;
  },
) => {
  const res = await instance.get(`/api/v1/stores/${id}`, {
    params: {
      membersPage: params?.membersPage ?? 1,
      membersLimit: params?.membersLimit ?? 5,
      productsPage: params?.productsPage ?? 1,
      productsLimit: params?.productsLimit ?? 5,
    },
  });
  return res.data;
};

export const updateStore = async (id: number, payload: any) => {
  const res = await instance.patch(`/api/v1/stores/${id}`, payload);
  return res.data;
};

export const findAllStoresWithActiveRental = async (floorId?: number) => {
  const res = await instance.get("/api/v1/stores/rented", {
    params: {
      floorId: floorId,
    },
  });
  return res.data;
};
