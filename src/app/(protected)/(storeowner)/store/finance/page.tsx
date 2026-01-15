"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import PaymentHistoryList from "@/components/(store)/finance/PaymentHistoryList";

export default function StoreFinancePage() {
  const store = useSelector((state: RootState) => state.store.activeStore);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Lịch sử thanh toán
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {store ? `Cửa hàng: ${store.name}` : "Vui lòng chọn cửa hàng"}
        </p>
      </div>

      <PaymentHistoryList />
    </div>
  );
}
