"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import History from "@/components/(staff)/history";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function HistoryPage() {
  const store = useSelector((state: RootState) => state.store.activeStore);
  const storeId = store?.id || 0;
  return (
    <div>
      <PageBreadcrumb pageTitle="Lịch sử hóa đơn" />
      <History storeId={storeId} />
    </div>
  );
}
