"use client";

import React, { useState } from "react";
import {
  useAdminOverview,
  useAdminRevenueByMonth,
} from "@/hooks/useStatistical";
import ComponentCard from "@/components/common/ComponentCard";
import { Store, Users, MapPin, FileText, DollarSign } from "lucide-react";
import { TextField } from "@mui/material";

export default function AdminOverview() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { data, isLoading, error } = useAdminOverview();
  const { data: revenueData } = useAdminRevenueByMonth(selectedYear);

  if (isLoading) {
    return (
      <ComponentCard title="Tổng quan">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </ComponentCard>
    );
  }

  if (error) {
    return (
      <ComponentCard title="Tổng quan">
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
      label: "Cửa hàng",
      value: data?.totalStores || 0,
      icon: <Store className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      label: "Chủ cửa hàng",
      value: data?.totalStoreOwners || 0,
      icon: <Users className="h-6 w-6" />,
      color:
        "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },
    {
      label: "Mặt bằng đã thuê",
      value: data?.activeRentals || 0,
      icon: <MapPin className="h-6 w-6" />,
      color:
        "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
    {
      label: "Hợp đồng hiệu lực",
      value: data?.activeContracts || 0,
      icon: <FileText className="h-6 w-6" />,
      color:
        "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
