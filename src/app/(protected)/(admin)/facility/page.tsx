"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listFacilities, deleteFacility } from "@/api/facility";
import ComponentCard from "@/components/common/ComponentCard";
import CreateFacilityModal from "@/components/(admin)/facility/CreateFacilityModal";
import EditFacilityModal from "@/components/(admin)/facility/EditFacilityModal";
import { Trash2, Edit, Plus } from "lucide-react";
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Tên</th>
                  <th className="px-4 py-3 text-left font-medium">Khu vực</th>
                  <th className="px-4 py-3 text-left font-medium">Giá</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Ghi chú</th>
                  <th className="px-4 py-3 text-center font-medium">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {facilities.map((facility: any) => (
                  <tr
                    key={facility.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-3">{facility.name}</td>
                    <td className="px-4 py-3">
                      {facility.area?.code} (Tầng {facility.area?.floor?.level})
                    </td>
                    <td className="px-4 py-3">
                      {Number(facility.price).toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="px-4 py-3">
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
                    <td className="px-4 py-3">{facility.note || "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setEditingFacility(facility)}
                        className="inline-flex items-center gap-1 rounded px-2 py-1 text-blue-600 hover:bg-blue-100"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(facility.id)}
                        className="ml-2 inline-flex items-center gap-1 rounded px-2 py-1 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
            >
              Trước
            </button>
            <span className="text-sm">
              Trang {meta.page} / {meta.totalPages}
            </span>
            <button
              disabled={page === meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
            >
              Sau
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
