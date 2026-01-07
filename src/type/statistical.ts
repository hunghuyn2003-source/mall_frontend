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