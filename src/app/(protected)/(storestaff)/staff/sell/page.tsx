"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Sell from "@/components/(staff)/sell";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function SellPage() {
  const store = useSelector((state: RootState) => state.store.activeStore);

  const storeId = store?.id || 0;

  return (
    <div>
      <PageBreadcrumb pageTitle="Bán hàng" />
      <Sell storeId={storeId} />
    </div>
  );
}
