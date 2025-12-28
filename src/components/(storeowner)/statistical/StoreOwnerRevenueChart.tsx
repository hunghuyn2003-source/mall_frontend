"use client";

import React, { useState } from "react";
import { useStoreOwnerRevenueByMonth } from "@/hooks/useStatistical";
import ComponentCard from "@/components/common/ComponentCard";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StoreOwnerRevenueChart() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Lấy storeId từ Redux
  const activeStore = useSelector((state: RootState) => state.store.activeStore);
  const storeId = activeStore?.id;

  const { data, isLoading, error } = useStoreOwnerRevenueByMonth(storeId, selectedYear);

  if (!storeId) {
    return (
      <ComponentCard title="Thống kê doanh thu theo tháng">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Vui lòng chọn cửa hàng</div>
        </div>
      </ComponentCard>
    );
  }

  if (isLoading) {
    return (
      <ComponentCard title="Thống kê doanh thu theo tháng">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </ComponentCard>
    );
  }

  if (error) {
    return (
      <ComponentCard title="Thống kê doanh thu theo tháng">
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">Lỗi khi tải dữ liệu</div>
        </div>
      </ComponentCard>
    );
  }

  // Prepare chart data
  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const chartData = data?.data.map((item) => item.revenue) || [];
  const categories = monthNames;

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    yaxis: {
      title: {
        text: "Doanh thu (VNĐ)",
      },
      labels: {
        formatter: (val: number) => {
          return (val / 1000000).toFixed(1) + "M";
        },
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          return val.toLocaleString("vi-VN") + " VNĐ";
        },
      },
    },
  };

  const series = [
    {
      name: "Doanh thu",
      data: chartData,
    },
  ];

  return (
    <ComponentCard title="Doanh thu theo tháng">
      <div className="space-y-4">
        <div className="flex justify-end">
          <div className="w-full sm:w-48">
            <TextField
              type="number"
              label="Năm"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              inputProps={{ min: 2000, max: 2100 }}
              fullWidth
              size="small"
            />
          </div>
        </div>

        <div className="custom-scrollbar max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={350}
            />
          </div>
        </div>
      </div>
    </ComponentCard>
  );
}
