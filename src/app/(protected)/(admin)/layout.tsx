"use client";

import React from "react";
import { useSidebar } from "@/context/SidebarContext";
import PrivateRoute from "@/components/privateroute/PrivateRoute";

import AppHeader from "@/layout/admin/AppHeader";
import AppSidebar from "@/layout/admin/AppSidebar";
import AppTopSideBar from "@/layout/storeowner/AppTopSideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen">
      {/* ADMIN */}
      <PrivateRoute allowedRoles={["ADMIN"]}>
        <div className="xl:flex">
          <AppSidebar />
          <div
            className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
          >
            <AppHeader />
            <div className="mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6">
              {children}
            </div>
          </div>
        </div>
      </PrivateRoute>
    </div>
  );
}
