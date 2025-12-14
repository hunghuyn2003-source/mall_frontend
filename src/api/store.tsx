import instance from "@/utils/axios";

export const createStore = async (payload: any) => {
  const res = await instance.post("/api/v1/stores/create", payload);
  return res.data;
};
