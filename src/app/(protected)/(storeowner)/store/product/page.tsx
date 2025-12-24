"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Product from "@/components/(store)/product";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function ProductPage() {
  const store = useSelector((state: RootState) => state.store.activeStore);
  const storeId = store?.id || 0;

  return (
    <div>
      <PageBreadcrumb pageTitle="Sản phẩm" />
      <Product storeId={storeId} />
    </div>
  );
}
