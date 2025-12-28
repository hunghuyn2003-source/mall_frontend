import instance from "@/utils/axios";

export const listFloors = async () => {
  const res = await instance.get("/api/v1/location/floors");
  return res.data;
};

export const getAreasByFloor = async (floorId: number, limit?: number) => {
  const res = await instance.get(
    `/api/v1/location/floors/${floorId}/areas`,
    {
      params: {
        limit: limit ?? 30, 
      },
    }
  );

  return res.data;
};




export const getUsedAreasByFloor = async (floorId: number) => {
  const res = await instance.get(
    `/api/v1/location/floors/${floorId}/used-areas`,
  );
  return res.data;
};

export const updateArea = async (id: number, payload: any) => {
  const res = await instance.patch(`/api/v1/location/areas/${id}`, payload);
  return res.data;
};
