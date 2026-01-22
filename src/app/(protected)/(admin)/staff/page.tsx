"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listMallStaff, deleteMallStaff } from "@/api/mall-staff";
import ComponentCard from "@/components/common/ComponentCard";
import CreateMallStaffModal from "@/components/(admin)/staff/CreateMallStaffModal";
import EditMallStaffModal from "@/components/(admin)/staff/EditMallStaffModal";
import { Trash2, Edit, Plus } from "lucide-react";
import { toast } from "react-toastify";

export default function MallStaffPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const { data: staffData, isLoading } = useQuery({
    queryKey: ["mall-staff", page],
    queryFn: () => listMallStaff({ page, limit }),
  });

  const staffs = staffData?.data || [];
  const meta = staffData?.meta;

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteMallStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mall-staff"] });
      toast.success("Xóa nhân sự thành công");
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
        <h1 className="text-xl font-bold">Quản lý nhân sự</h1>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus size={20} /> Thêm nhân sự
        </button>
      </div>

      <ComponentCard title="Danh sách nhân sự">
        {isLoading ? (
          <div className="py-8 text-center">Đang tải...</div>
        ) : staffs.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            Không có nhân sự nào
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Chức vụ</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Điện thoại
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Lương</th>
                  <th className="px-4 py-3 text-left font-medium">Giới tính</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {staffs.map((staff: any) => (
                  <tr
                    key={staff.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-3">{staff.position}</td>
                    <td className="px-4 py-3">{staff.email}</td>
                    <td className="px-4 py-3">{staff.phone}</td>
                    <td className="px-4 py-3">
                      {Number(staff.salary).toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="px-4 py-3">{staff.gender}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          staff.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {staff.isActive ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setEditingStaff(staff)}
                        className="inline-flex items-center gap-1 rounded px-2 py-1 text-blue-600 hover:bg-blue-100"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(staff.id)}
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

      <CreateMallStaffModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {editingStaff && (
        <EditMallStaffModal
          staff={editingStaff}
          isOpen={!!editingStaff}
          onClose={() => setEditingStaff(null)}
        />
      )}
    </>
  );
}
