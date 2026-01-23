"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { listStoreInvoices } from "@/api/storeInvoice";
import ComponentCard from "@/components/common/ComponentCard";
import { Eye, CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
import InvoiceDetailModal from "./InvoiceDetailModal";
import PaymentQRModal from "./PaymentQRModal";
import { RootState } from "@/store";
import { formatMonthYear } from "@/helper/format";

export default function StoreInvoicesPage() {
  const queryClient = useQueryClient();
  const store = useSelector((state: RootState) => state.store.activeStore);
  const storeId = store?.id || 0;

  const [page, setPage] = useState(1);
  const limit = 10;
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentInvoice, setPaymentInvoice] = useState(null);

  const { data: invoiceData, isLoading } = useQuery({
    queryKey: ["store-invoices", storeId, page],
    queryFn: () => listStoreInvoices(storeId, { page, limit }),
    enabled: !!storeId,
  });

  const invoices = invoiceData?.data || [];
  const meta = invoiceData?.meta;

  if (!storeId) {
    return (
      <div className="py-8 text-center text-gray-500">
        Vui lòng chọn cửa hàng trước
      </div>
    );
  }

  return (
    <>
      <ComponentCard title="">
        {isLoading ? (
          <div className="py-8 text-center">Đang tải...</div>
        ) : invoices.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            Không có hóa đơn nào
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[1000px]">
                <table className="w-full">
                  <thead className="border-b border-gray-100 dark:border-white/5">
                    <tr>
                      <th className="px-5 py-3 text-start font-medium text-gray-500">
                        Mã hóa đơn
                      </th>
                      <th className="px-2 py-3 text-start font-medium text-gray-500">
                        Nội dung
                      </th>

                      <th className="px-5 py-3 text-start font-medium text-gray-500">
                        Phí mặt bằng/dịch vụ
                      </th>
                      <th className="px-5 py-3 text-start font-medium text-gray-500">
                        Phí điện
                      </th>
                      <th className="px-5 py-3 text-start font-medium text-gray-500">
                        Phí nước
                      </th>
                      <th className="px-5 py-3 text-start font-medium text-gray-500">
                        Tổng tiền
                      </th>
                      <th className="px-2 py-3 text-start font-medium text-gray-500">
                        Hạn
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
                    {invoices.map((invoice: any) => (
                      <tr
                        key={invoice.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="text-md px-5 py-3 font-medium text-gray-800 dark:text-white">
                          {invoice.invoiceCode}
                        </td>
             <td className="px-2 py-3 text-md text-gray-800 dark:text-white max-w-[140px] break-words">
  {invoice.note || "___"}
</td>

          
                        <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                          {Number(invoice.contractFee).toLocaleString("vi-VN")} đ
                        </td>
                        <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                          {Number(invoice.electricityFee).toLocaleString("vi-VN")} đ
                        </td>
                        <td className="text-md px-5 py-3 text-gray-800 dark:text-white">
                          {Number(invoice.waterFee).toLocaleString("vi-VN")} đ
                        </td>
                        <td className="text-md px-5 py-3 font-medium text-gray-800 dark:text-white">
                          {Number(invoice.totalAmount).toLocaleString("vi-VN")} đ
                        </td>
                        <td className="text-md px-2 py-3 text-gray-800 dark:text-white">
                          {new Date(invoice.dueDate).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-5 py-3">
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
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedInvoice(invoice)}
                              className="flex items-center gap-1 rounded bg-blue-600 px-1 py-1 text-xs text-white hover:bg-blue-700"
                            >
                              <Eye size={14} />
                            </button>
                            {invoice.status === "DEBIT" && (
                              <button
                                onClick={() => setPaymentInvoice(invoice)}
                                className="flex items-center gap-1 rounded bg-green-600 px-1 py-1 text-xs text-white hover:bg-green-700"
                              >
                                <CreditCard size={14} />
                              </button>
                            )}
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

      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {paymentInvoice && (
        <PaymentQRModal
          invoice={paymentInvoice}
          isOpen={!!paymentInvoice}
          onClose={() => setPaymentInvoice(null)}
          storeId={storeId}
        />
      )}
    </>
  );
}
