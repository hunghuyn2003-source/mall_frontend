"use client";

import React from "react";
import { useSidebar } from "@/context/SidebarContext";
import SelectStorePage from "@/layout/storeowner/SelectStore";

import AppTopSideBar from "@/layout/storeowner/AppTopSideBar";
import PrivateRoute from "@/components/privateroute/PrivateRoute";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const store = useSelector((state: RootState) => state.store.activeStore);

  if (!store) {
    return (
      <PrivateRoute allowedRoles={["STOREOWNER", "STORESTAFF"]}>
        <SelectStorePage />
      </PrivateRoute>
    );
  }

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-30 lg:mr-30 mt-4"
      : "lg:ml-[90px] lg:mr-[90px]";

  return (
    <div className="min-h-screen">
      <PrivateRoute allowedRoles={["STOREOWNER", "STORESTAFF"]}>
        <AppTopSideBar />
        <div
          className={`mx-auto max-w-(--breakpoint-2xl) pt-5 ${mainContentMargin}`}
        >
          {children}
        </div>
      </PrivateRoute>
    </div>
  );
}
