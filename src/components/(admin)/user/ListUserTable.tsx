"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listUser, deleteUser } from "@/api/user";
import { ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { ROLE_LABEL } from "@/helper/Label";
import { toast } from "react-toastify";

interface Props {
  onEdit: (user: any) => void;
}

export default function ListUserTable({ onEdit }: Props) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: userData } = useQuery({
    queryKey: ["users", page, debouncedSearch],
    queryFn: () => listUser({ page, limit, search: debouncedSearch }),
    placeholderData: (prev) => prev,
  });

  const users = userData?.data || [];
  const meta = userData?.meta;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("Xóa tài khoản thành công");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Xóa tài khoản thất bại");
    },
  });

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa tài khoản "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Tìm theo tên, email..."
          className="text-md w-[300px] rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b border-gray-100 dark:border-white/5">
              <tr>
                <th className="px-5 py-3 text-start font-medium text-gray-500">
                  Tên
                </th>
                <th className="px-5 py-3 text-start font-medium text-gray-500">
                  Email
                </th>
                <th className="px-5 py-3 text-start font-medium text-gray-500">
                  Vai trò
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
              {users.map((user: any) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                    <div className="flex items-center gap-2">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                          {user.name?.charAt(0) || "?"}
                        </div>
                      )}
                      {user.name || "___"}
                    </div>
                  </td>
                  <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                    {user.email || "___"}
                  </td>
                  <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "STOREOWNER"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {ROLE_LABEL[user.role] || user.role}
                    </span>
                  </td>
                  <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
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

      <div className="flex items-center justify-end gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-md text-gray-600">
          Trang {meta?.page} / {meta?.totalPages}
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
