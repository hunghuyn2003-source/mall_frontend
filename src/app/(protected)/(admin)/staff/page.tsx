"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listMallStaff, deleteMallStaff } from "@/api/mall-staff";
import ComponentCard from "@/components/common/ComponentCard";
import CreateMallStaffModal from "@/components/(admin)/staff/CreateMallStaffModal";
import EditMallStaffModal from "@/components/(admin)/staff/EditMallStaffModal";
import SalarySettlementModal from "@/components/(admin)/staff/SalarySettlementModal";
import { Trash2, Edit, Plus, ChevronLeft, ChevronRight, DollarSign } from "lucide-react";
import { toast } from "react-toastify";

export default function MallStaffPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isSalarySettlementOpen, setIsSalarySettlementOpen] = useState(false);

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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSalarySettlementOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            <DollarSign size={20} /> Quyết toán lương
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Plus size={20} /> Thêm nhân sự
          </button>
        </div>
      </div>

      <ComponentCard title="Danh sách nhân sự">
        {isLoading ? (
          <div className="py-8 text-center">Đang tải...</div>
        ) : staffs.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            Không có nhân sự nào
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
                        Chức vụ
                      </th>
                      <th className="px-5 py-3 text-start font-medium text-gray-500">
                        Email
                      </th>
                      <th className="px-5 py-3 text-start font-medium text-gray-500">
                        Điện thoại
                      </th>
                      <th className="px-5 py-3 text-start font-medium text-gray-500">
                        Lương
                      </th>
                      <th className="px-5 py-3 text-start font-medium text-gray-500">
                        Giới tính
                      </th>
                      <th className="px-5 py-3 text-start font-medium text-gray-500">
                        Trạng thái
                      </th>
                      <th className="px-5 py-3 text-start font-medium text-gray-500">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {staffs.map((staff: any) => (
                      <tr
                        key={staff.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                          {staff.name}
                        </td>
                        <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                          {staff.position}
                        </td>
                        <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                          {staff.email}
                        </td>
                        <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                          {staff.phone}
                        </td>
                        <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                          {Number(staff.salary).toLocaleString("vi-VN")} đ
                        </td>
                        <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                          {staff.gender === "MALE" || staff.gender === "male"
                            ? "Nam"
                            : staff.gender === "FEMALE" || staff.gender === "female"
                              ? "Nữ"
                              : "Khác"}
                        </td>
                        <td className="px-5 py-3">
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
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingStaff(staff)}
                              className="flex items-center gap-1 rounded bg-blue-600 px-1 py-1 text-xs text-white hover:bg-blue-700"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(staff.id)}
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

      <SalarySettlementModal
        isOpen={isSalarySettlementOpen}
        onClose={() => setIsSalarySettlementOpen(false)}
      />
    </>
  );
}
