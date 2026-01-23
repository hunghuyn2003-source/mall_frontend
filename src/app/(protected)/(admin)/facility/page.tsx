"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listFacilities, deleteFacility } from "@/api/facility";
import ComponentCard from "@/components/common/ComponentCard";
import CreateFacilityModal from "@/components/(admin)/facility/CreateFacilityModal";
import EditFacilityModal from "@/components/(admin)/facility/EditFacilityModal";
import { Trash2, Edit, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";

export default function FacilityPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);

  const { data: facilitiesData, isLoading } = useQuery({
    queryKey: ["facilities", page],
    queryFn: () => listFacilities({ page, limit }),
  });

  const facilities = facilitiesData?.data || [];
  const meta = facilitiesData?.meta;

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteFacility(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      toast.success("Xóa cơ sở vật chất thành công");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Lỗi khi xóa");
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Bạn chắc chắn muốn xóa?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Cơ sở vật chất</h1>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus size={20} /> Thêm cơ sở vật chất
        </button>
      </div>

      <ComponentCard title="Danh sách cơ sở vật chất">
        {isLoading ? (
          <div className="py-8 text-center">Đang tải...</div>
        ) : facilities.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            Không có cơ sở vật chất nào
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[800px]">
                <table className="w-full">
                  <thead className="border-b border-gray-100 dark:border-white/5">
                    <tr>
                      <th className="px-5 py-3 text-start font-medium text-gray-500">
                        Tên
                      </th>
                      <th className="px-5 py-3 text-start font-medium text-gray-500">
                        Khu vực
                      </th>
                      <th className="px-5 py-3 text-start font-medium text-gray-500">
                        Giá
                      </th>
                      <th className="px-5 py-3 text-start font-medium text-gray-500">
                        Trạng thái
                      </th>
                      <th className="px-5 py-3 text-start font-medium text-gray-500">
                        Ghi chú
                      </th>
                      <th className="px-5 py-3 text-start font-medium text-gray-500">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {facilities.map((facility: any) => (
                      <tr
                        key={facility.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                          {facility.name}
                        </td>
                        <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                          {facility.area?.code} (Tầng {facility.area?.floor?.level})
                        </td>
                        <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                          {Number(facility.price).toLocaleString("vi-VN")} đ
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-sm ${
                              facility.status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : facility.status === "MAINTENANCE"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {facility.status === "ACTIVE"
                              ? "Hoạt động"
                              : facility.status === "MAINTENANCE"
                                ? "Bảo trì"
                                : "Hư hỏng"}
                          </span>
                        </td>
                        <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                          {facility.note || "___"}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingFacility(facility)}
                              className="flex items-center gap-1 rounded bg-blue-600 px-1 py-1 text-xs text-white hover:bg-blue-700"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(facility.id)}
                              className="flex items-center gap-1 rounded bg-red-600 px-1 py-1 text-xs text-white hover:bg-red-700"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {meta && (
          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-md text-gray-600">
              Trang {meta.page} / {meta.totalPages}
            </span>
            <button
              disabled={page === meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </ComponentCard>

      <CreateFacilityModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {editingFacility && (
        <EditFacilityModal
          facility={editingFacility}
          isOpen={!!editingFacility}
          onClose={() => setEditingFacility(null)}
        />
      )}
    </>
  );
}
