"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAreasByFloor } from "@/api/location";
import { Edit } from "lucide-react";

interface Props {
  floorId: number;
  onEdit: (area: any) => void;
}

export default function ListAreaTable({ floorId, onEdit }: Props) {
  const { data: areasData, isLoading } = useQuery({
    queryKey: ["areas", floorId],
    queryFn: () => getAreasByFloor(floorId),
    enabled: floorId > 0,
  });

  const areas = areasData?.areas || [];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div>Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-100 dark:border-white/5">
            <tr>
              <th className="px-5 py-3 text-start font-medium text-gray-500">
                Mã khu vực
              </th>
              <th className="px-5 py-3 text-start font-medium text-gray-500">
                Diện tích (m²)
              </th>
              <th className="px-5 py-3 text-start font-medium text-gray-500">
                Giá thuê
              </th>
              <th className="px-5 py-3 text-start font-medium text-gray-500">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {areas.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              areas.map((area: any) => (
                <tr
                  key={area.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-5 py-3 text-gray-800 dark:text-white">
                    {area.code}
                  </td>
                  <td className="px-5 py-3 text-gray-800 dark:text-white">
                    {area.acreage}
                  </td>
                  <td className="px-5 py-3 text-gray-800 dark:text-white">
                    {area.price.toLocaleString("vi-VN")} đ
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => onEdit(area)}
                      className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                    >
                      <Edit size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
