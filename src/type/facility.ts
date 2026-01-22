export interface Facility {
  id: number;
  name: string;
  areaId: number;
  area?: {
    id: number;
    code: string;
    acreage: number;
    floor: {
      level: number;
    };
  };
  status: "ACTIVE" | "MAINTENANCE" | "BROKEN";
  price: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFacility {
  name: string;
  areaId: number;
  price: number;
  note?: string;
}

export interface UpdateFacility {
  name?: string;
  status?: "ACTIVE" | "MAINTENANCE" | "BROKEN";
  price?: number;
  note?: string;
}
