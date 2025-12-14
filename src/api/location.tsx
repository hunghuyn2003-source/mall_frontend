import instance from "@/utils/axios";

export const listFloors = async () => {
  const res = await instance.get("/api/v1/location/floors");
  return res.data;
};

export const getAreasByFloor = async (floorId: number) => {
  const res = await instance.get(`/api/v1/location/floors/${floorId}/areas`);
  return res.data;
};
