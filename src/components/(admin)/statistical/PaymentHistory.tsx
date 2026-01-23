"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminPaymentHistory } from "@/api/statistical";
import { ChevronLeft, ChevronRight, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";

import { formatDateTime } from "@/helper/format";
export default function PaymentHistory() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: historyData, isLoading } = useQuery({
    queryKey: ["payment-history", page],
    queryFn: () => getAdminPaymentHistory({ page, limit }),
    placeholderData: (prev) => prev,
  });

  const history = historyData?.data || [];
  const meta = historyData?.meta;

  if (isLoading) {
    return (
      <ComponentCard title="Lịch sử thu chi">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </ComponentCard>
    );
  }

  return (
    <ComponentCard title="Lịch sử thu chi">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <table className="w-full">
              <thead className="border-b border-gray-100 dark:border-white/5">
                <tr>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Loại
                  </th>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Số tiền
                  </th>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Ghi chú
                  </th>
                  <th className="px-5 py-3 text-start font-medium text-gray-500">
                    Ngày
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {history.map((item: any) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                   <td className="px-5 py-3">
  <div className="flex items-center gap-2">
    {item.direction === "IN" ? (
      <ArrowDownCircle className="h-5 w-5 text-green-400" />
    ) : (
      <ArrowUpCircle className="h-5 w-5 text-red-600" />
    )}

    <span
      className={`text-sm font-medium ${
        item.direction === "IN"
          ? "text-green-400"
          : "text-red-600"
      }`}
    >
      {item.direction === "IN" ? "Thu" : "Chi"}
    </span>
  </div>
</td>

                    <td className="px-5 py-3 text-gray-800 dark:text-white">
                      <span
                        className={`font-semibold ${
                          item.direction === "IN"
                            ? "text-green-400"
                            : "text-red-600"
                        }`}
                      >
                        {item.direction === "IN" ? "+" : "-"}
                        {item.amount.toLocaleString("vi-VN")} đ
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-800 dark:text-white">
                      {item.note || "___"}
                    </td>
                    <td className="px-5 py-3 text-gray-800 dark:text-white">
                      {formatDateTime(item.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3">
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
    </ComponentCard>
  );
}
