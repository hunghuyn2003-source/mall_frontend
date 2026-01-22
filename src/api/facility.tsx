import instance from "@/utils/axios";

export const listFacilities = async (params?: {
  page?: number;
  limit?: number;
  areaId?: number;
}) => {
  const res = await instance.get("/api/v1/admin/facilities", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      areaId: params?.areaId,
    },
  });
  return res.data;
};

export const getFacilityDetail = async (id: number) => {
  const res = await instance.get(`/api/v1/admin/facilities/${id}`);
  return res.data;
};

export const createFacility = async (payload: any) => {
  const res = await instance.post("/api/v1/admin/facilities", payload);
  return res.data;
};

export const updateFacility = async (id: number, payload: any) => {
  const res = await instance.patch(`/api/v1/admin/facilities/${id}`, payload);
  return res.data;
};

export const deleteFacility = async (id: number) => {
  const res = await instance.delete(`/api/v1/admin/facilities/${id}`);
  return res.data;
};
