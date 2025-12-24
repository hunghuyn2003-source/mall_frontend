"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { listStaff } from "@/api/staff";
import { ChevronLeft, ChevronRight, Edit, Plus } from "lucide-react";
import { GENDER_LABEL } from "@/helper/Label";

interface Props {
  storeId: number;
  onEdit: (staff: any) => void;
  onCreate: () => void;
}

export default function ListStaffTable({ storeId, onEdit, onCreate }: Props) {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: staffData } = useQuery({
    queryKey: ["staffs", storeId, page, debouncedSearch],
    queryFn: () => listStaff({ page, limit, search: debouncedSearch, storeId }),
    placeholderData: (prev) => prev,
  });

  const staffs = staffData?.data || [];
  const meta = staffData?.meta;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Tìm theo tên hoặc email"
          className="text-md w-[300px] rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        />
        <button
          onClick={onCreate}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus size={16} />
          Thêm nhân viên
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <table className="w-full">
              <thead className="border-b border-gray-100 dark:border-white/5">
                <tr>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Tên
                  </th>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Email
                  </th>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Số điện thoại
                  </th>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Ngày sinh
                  </th>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Giới tính
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
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => onEdit(staff)}
                  >
                    <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                      {staff.user?.name || "___"}
                    </td>
                    <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                      {staff.user?.email || "___"}
                    </td>
                    <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                      {staff.user?.phone || "___"}
                    </td>
                    <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                      {staff.user?.birth
                        ? new Date(staff.user.birth).toLocaleDateString("vi-VN")
                        : "___"}
                    </td>
                    <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                      {GENDER_LABEL[staff.user?.gender] || "___"}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(staff);
                        }}
                        className="flex items-center gap-1 rounded bg-blue-600 px-1 py-1 text-xs text-white hover:bg-blue-700"
                      >
                        <Edit size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-md text-gray-600">
          Trang {meta?.page || 1} / {meta?.totalPages || 1}
        </span>
        <button
          disabled={page === meta?.totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
