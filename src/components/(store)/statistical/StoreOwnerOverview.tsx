"use client";

import React, { useState } from "react";
import {
  useStoreOwnerOverview,
  useStoreOwnerRevenueByMonth,
} from "@/hooks/useStatistical";
import ComponentCard from "@/components/common/ComponentCard";
import { Users, Package, DollarSign } from "lucide-react";
import { TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function StoreOwnerOverview() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  

  const activeStore = useSelector((state: RootState) => state.store.activeStore);
  const storeId = activeStore?.id;

  const { data, isLoading, error } = useStoreOwnerOverview(storeId);
  const { data: revenueData } = useStoreOwnerRevenueByMonth(storeId, selectedYear);

  if (!storeId) {
    return (
      <ComponentCard title="Thống kê tổng quan">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Vui lòng chọn cửa hàng</div>
        </div>
      </ComponentCard>
    );
  }

  if (isLoading) {
    return (
      <ComponentCard title="Thống kê tổng quan">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </ComponentCard>
    );
  }

  if (error) {
    return (
      <ComponentCard title="Thống kê tổng quan">
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">Lỗi khi tải dữ liệu</div>
        </div>
      </ComponentCard>
    );
  }

  const stats = [
    {
      label: "Tổng doanh thu",
      value: revenueData?.totalRevenue || 0,
      icon: <DollarSign className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      isMoney: true,
      year: revenueData?.year || selectedYear,
    },
    {
      label: "Tổng số nhân viên",
      value: data?.totalStaff || 0,
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      label: "Tổng số sản phẩm",
      value: data?.totalProducts || 0,
      icon: <Package className="h-6 w-6" />,
      color:
        "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
                {stat.year && (
                  <span className="ml-1 text-xs">({stat.year})</span>
                )}
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {stat.isMoney
                  ? `${stat.value.toLocaleString("vi-VN")} VND`
                  : stat.value.toLocaleString("vi-VN")}
              </p>
            </div>
            <div className={`rounded-lg p-3 ${stat.color}`}>{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
