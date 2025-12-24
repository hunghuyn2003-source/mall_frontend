"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Staff from "@/components/(store)/staff";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function StaffPage() {
  const store = useSelector((state: RootState) => state.store.activeStore);
  const storeId = store?.id || 0;

  return (
    <div>
      <PageBreadcrumb pageTitle="Nhân viên" />
      <Staff storeId={storeId} />
    </div>
  );
}
