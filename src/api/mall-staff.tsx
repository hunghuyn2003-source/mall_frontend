import instance from "@/utils/axios";

export const listMallStaff = async (params?: {
  page?: number;
  limit?: number;
}) => {
  const res = await instance.get("/api/v1/admin/mall-staff", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
    },
  });
  return res.data;
};

export const getMallStaffDetail = async (id: number) => {
  const res = await instance.get(`/api/v1/admin/mall-staff/${id}`);
  return res.data;
};

export const createMallStaff = async (payload: any) => {
  const res = await instance.post("/api/v1/admin/mall-staff", payload);
  return res.data;
};

export const updateMallStaff = async (id: number, payload: any) => {
  const res = await instance.patch(`/api/v1/admin/mall-staff/${id}`, payload);
  return res.data;
};

export const deleteMallStaff = async (id: number) => {
  const res = await instance.delete(`/api/v1/admin/mall-staff/${id}`);
  return res.data;
};

export const salarySalementment = async () => {
  const res = await instance.post("/api/v1/admin/mall-staff/salary-settlement");
  return res.data;
};

export const getTotalSalaryInfo = async () => {
  const res = await instance.get(
    "/api/v1/admin/mall-staff/total-salary-info/all",
  );
  return res.data;
};
