import instance from "@/utils/axios";
import { CreateUser, CreateOwner } from "@/type/user";

export const listUser = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const res = await instance.get("/api/v1/users", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      search: params?.search,
    },
  });
  return res.data;
};

export const listOwner = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const res = await instance.get("/api/v1/users/owner", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      search: params?.search,
    },
  });

  return res.data;
};

export const createUser = async (payload: CreateUser) => {
  const res = await instance.post("/api/v1/users", payload);
  return res.data;
};

export const createOwner = async (payload: CreateOwner) => {
  const res = await instance.post("/api/v1/users/owner", payload);
  return res.data;
};

export const listAdmin = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const res = await instance.get("/api/v1/users/admin", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      search: params?.search,
    },
  });

  return res.data;
};

export const updateUser = async (id: number, payload: any) => {
  const res = await instance.patch(`/api/v1/users/${id}`, payload);
  return res.data;
};

export const deleteUser = async (id: number) => {
  const res = await instance.delete(`/api/v1/users/${id}`);
  return res.data;
};

export const getUser = async (id: number) => {
  const res = await instance.get(`/api/v1/users/${id}`);
  return res.data;
};
