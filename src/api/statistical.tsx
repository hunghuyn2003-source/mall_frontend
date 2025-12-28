import instance from "@/utils/axios";

// Types
export interface RevenueByMonthResponse {
  year: number;
  data: Array<{
    month: number;
    revenue: number;
  }>;
  totalRevenue: number;
}

export interface AdminOverviewResponse {
  totalStores: number;
  totalStoreOwners: number;
  activeRentals: number;
  activeContracts: number;
}

export interface StoreOwnerOverviewResponse {
  totalStaff: number;
  totalProducts: number;
}

// Admin API functions
export const getAdminRevenueByMonth = async (
  year?: number,
): Promise<RevenueByMonthResponse> => {
  const params = year ? { year } : {};
  const res = await instance.get("/api/v1/statistical/admin/revenue-by-month", {
    params,
  });
  return res.data;
};

export const getAdminOverview = async (): Promise<AdminOverviewResponse> => {
  const res = await instance.get("/api/v1/statistical/admin/overview");
  return res.data;
};

// StoreOwner API functions
export const getStoreOwnerRevenueByMonth = async (
  storeId: number,
  year?: number,
): Promise<RevenueByMonthResponse> => {
  const params: any = { storeId };
  if (year) {
    params.year = year;
  }
  const res = await instance.get(
    "/api/v1/statistical/storeowner/revenue-by-month",
    {
      params,
    },
  );
  return res.data;
};

export const getStoreOwnerOverview = async (
  storeId: number,
): Promise<StoreOwnerOverviewResponse> => {
  const res = await instance.get(
    "/api/v1/statistical/storeowner/overview",
    {
      params: { storeId },
    },
  );
  return res.data;
};
