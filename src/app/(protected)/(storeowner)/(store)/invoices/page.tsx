"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { listStoreInvoices, payInvoice } from "@/api/invoice";
import ComponentCard from "@/components/common/ComponentCard";
import { Eye, CreditCard } from "lucide-react";
import { toast } from "react-toastify";
import InvoiceDetailModal from "./InvoiceDetailModal";

export default function StoreInvoicesPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const store = useSelector((state: any) => state.store.selectedStore);

  const storeId = parseInt(params?.storeId as string) || store?.id;
  const [page, setPage] = useState(1);
  const limit = 10;
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const { data: invoiceData, isLoading } = useQuery({
    queryKey: ["store-invoices", storeId, page],
    queryFn: () => listStoreInvoices(storeId, { page, limit }),
    enabled: !!storeId,
  });

  const invoices = invoiceData?.data || [];
  const meta = invoiceData?.meta;

  const payMutation = useMutation({
    mutationFn: (invoiceId: number) => payInvoice(storeId, invoiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-invoices"] });
      toast.success("Thanh toán hóa đơn thành công");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Lỗi khi thanh toán");
    },
  });

  const handlePay = (invoiceId: number) => {
    if (confirm("Bạn chắc chắn muốn thanh toán hóa đơn này?")) {
      payMutation.mutate(invoiceId);
    }
  };

  if (!storeId) {
    return (
      <div className="py-8 text-center text-gray-500">
        Vui lòng chọn cửa hàng trước
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Hóa đơn cửa hàng</h1>
      </div>

      <ComponentCard title="">
        {isLoading ? (
          <div className="py-8 text-center">Đang tải...</div>
        ) : invoices.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            Không có hóa đơn nào
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    Mã hóa đơn
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Tháng/Năm</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Phí dịch vụ
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Phí điện</th>
                  <th className="px-4 py-3 text-left font-medium">Phí nước</th>
                  <th className="px-4 py-3 text-left font-medium">Tổng tiền</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Hạn thanh toán
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {invoices.map((invoice: any) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-3 font-medium">
                      {invoice.invoiceCode}
                    </td>
                    <td className="px-4 py-3">{invoice.monthYear}</td>
                    <td className="px-4 py-3">
                      {Number(invoice.contractFee).toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="px-4 py-3">
                      {Number(invoice.electricityFee).toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="px-4 py-3">
                      {Number(invoice.waterFee).toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {Number(invoice.totalAmount).toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="px-4 py-3">
                      {new Date(invoice.dueDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          invoice.status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {invoice.status === "PAID"
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedInvoice(invoice)}
                        className="mr-2 inline-flex items-center gap-1 rounded px-2 py-1 text-blue-600 hover:bg-blue-100"
                      >
                        <Eye size={16} />
                      </button>
                      {invoice.status === "DEBIT" && (
                        <button
                          onClick={() => handlePay(invoice.id)}
                          disabled={payMutation.isPending}
                          className="inline-flex items-center gap-1 rounded px-2 py-1 text-green-600 hover:bg-green-100 disabled:opacity-50"
                        >
                          <CreditCard size={16} />
                        </button>
                      )}
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

      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </>
  );
}
