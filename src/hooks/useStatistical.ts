import { useQuery } from "@tanstack/react-query";
import {
  getAdminRevenueByMonth,
  getAdminOverview,
  getStoreOwnerRevenueByMonth,
  getStoreOwnerOverview,
} from "@/api/statistical";

export function useAdminRevenueByMonth(year?: number) {
  return useQuery({
    queryKey: ["adminRevenueByMonth", year],
    queryFn: () => getAdminRevenueByMonth(year),
    staleTime: 30 * 1000,
  });
}

export function useAdminOverview() {
  return useQuery({
    queryKey: ["adminOverview"],
    queryFn: getAdminOverview,
    staleTime: 30 * 1000,
  });
}

export function useStoreOwnerRevenueByMonth(storeId: number, year?: number) {
  return useQuery({
    queryKey: ["storeOwnerRevenueByMonth", storeId, year],
    queryFn: () => getStoreOwnerRevenueByMonth(storeId, year),
    staleTime: 30 * 1000,
    enabled: !!storeId, // Chỉ gọi API khi có storeId
  });
}

export function useStoreOwnerOverview(storeId: number) {
  return useQuery({
    queryKey: ["storeOwnerOverview", storeId],
    queryFn: () => getStoreOwnerOverview(storeId),
    staleTime: 30 * 1000,
    enabled: !!storeId, // Chỉ gọi API khi có storeId
  });
}
