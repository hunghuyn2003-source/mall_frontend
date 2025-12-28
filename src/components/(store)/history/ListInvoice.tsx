"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { historyInvoice } from "@/api/products";
import { ChevronLeft, ChevronRight, Receipt, Eye } from "lucide-react";
import { formatDate } from "@/helper/format";
interface Props {
  storeId: number;
  onViewDetail: (invoice: any) => void;
}

export default function ListInvoice({ storeId, onViewDetail }: Props) {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: invoiceData } = useQuery({
    queryKey: ["invoices", storeId, page],
    queryFn: () => historyInvoice({ page, limit, storeId }),
    placeholderData: (prev) => prev,
    enabled: !!storeId,
  });

  const invoices = invoiceData?.data || [];
  const meta = invoiceData?.meta;


  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-start font-medium text-gray-500">
                  Mã hóa đơn
                </th>
                <th className="px-5 py-3 text-start font-medium text-gray-500">
                  Ngày xuất đơn
                </th>
                <th className="px-5 py-3 text-start font-medium text-gray-500">
                  Nhân viên
                </th>

                <th className="px-5 py-3 text-start font-medium text-gray-500">
                  Tổng tiền
                </th>
                <th className="px-5 py-3 text-start font-medium text-gray-500">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((invoice: any) => (
                <tr
                  key={invoice.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onViewDetail(invoice)}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-gray-800">
                        #{invoice.id}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {invoice.createdAt ? formatDate(invoice.createdAt) : "___"}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {invoice.createdBy?.name || "___"}
                  </td>

                  <td className="px-5 py-3 font-semibold text-blue-600">
                    {(invoice.total || 0).toLocaleString("vi-VN")} đ
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetail(invoice);
                      }}
                      className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                    >
                      <Eye size={14} />
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}

              {invoices.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-gray-500"
                  >
                    Chưa có hóa đơn nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm text-gray-600">
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
