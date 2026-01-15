"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useGetPayments } from "@/hooks/useFinance";
import { PaymentStatus } from "@/type/finance";
import PaymentDebitForm from "./PaymentDebitForm";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface Payment {
  id: number;
  storeId: number;
  paymentMonth: number;
  paymentYear: number;
  amount: number;
  owed: number;
  status: PaymentStatus;
  paidAt: string;
  image?: string;
  createdAt: string;
}

export default function PaymentHistoryList() {
  const store = useSelector((state: RootState) => state.store.activeStore);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    data: paymentsData,
    isLoading,
    error,
  } = useGetPayments({
    storeId: store?.id,
    limit: 100,
  });

  const payments = paymentsData?.data || [];

  const handlePaymentClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedPayment(null);
  };

  if (!store) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-600 dark:bg-gray-700">
        <p className="text-gray-600 dark:text-gray-300">
          Vui lòng chọn cửa hàng
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-600 dark:bg-red-900">
        <p className="text-red-700 dark:text-red-200">
          Có lỗi xảy ra khi tải lịch sử thanh toán
        </p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-600 dark:bg-gray-700">
        <p className="text-gray-600 dark:text-gray-300">
          Không có lịch sử thanh toán nào
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {payments.map((payment: Payment) => (
          <div
            key={payment.id}
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-800"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Hóa đơn tháng {payment.paymentMonth}/{payment.paymentYear}
                  </h3>
                  <div
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                      payment.status === "PAID"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                        : "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200"
                    }`}
                  >
                    {payment.status === "PAID" ? (
                      <>
                        <CheckCircle size={14} />
                        Đã thanh toán
                      </>
                    ) : (
                      <>
                        <AlertCircle size={14} />
                        Ghi nợ
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    Số tiền thanh toán:{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {payment.amount.toLocaleString("vi-VN")} đ
                    </span>
                  </p>
                  {payment.status === "DEBIT" && payment.owed > 0 && (
                    <p>
                      Còn nợ:{" "}
                      <span className="font-medium text-orange-600 dark:text-orange-400">
                        {payment.owed.toLocaleString("vi-VN")} đ
                      </span>
                    </p>
                  )}
                  <p>
                    Ngày thanh toán:{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(payment.paidAt).toLocaleDateString("vi-VN")}
                    </span>
                  </p>
                  {payment.image && (
                    <p>
                      <a
                        href={payment.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Xem ảnh thanh toán
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {payment.status === "DEBIT" && payment.owed > 0 && (
                <button
                  onClick={() => handlePaymentClick(payment)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Thanh toán
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && selectedPayment && (
        <PaymentDebitForm payment={selectedPayment} onClose={handleFormClose} />
      )}
    </div>
  );
}
