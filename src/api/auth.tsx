import instance from "@/utils/axios";
import { TAuth } from "@/type/auth";

export const login = async (payload: TAuth) => {
  const res = await instance.post("/api/v1/auth/login", payload);
  return res.data;
};

export const logout = async () => {
  const res = await instance.post("/api/v1/auth/logout");
  return res.data;
};

export const getProfile = async () => {
  const res = await instance.get("/api/v1/auth/profile");
  return res.data;
};
