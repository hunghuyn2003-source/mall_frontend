"use client";

import React from "react";
import { useSidebar } from "@/context/SidebarContext";
import { useProfile } from "@/hooks/useProfile";
import { CircularProgress } from "@mui/material";
import AppHeader from "@/layout/admin/AppHeader";
import AppSidebar from "@/layout/admin/AppSidebar";
import AppTopSideBar from "@/layout/storeowner/AppTopSideBar";

import PrivateRoute from "@/components/privateroute/PrivateRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { data: user, isLoading } = useProfile();

  const isStoreRole =
    user?.role === "STOREOWNER" || user?.role === "STORESTAFF";

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      {/* STOREOWNER*/}
      {isStoreRole ? (
        <>
          <AppTopSideBar />
          <div className="mx-auto max-w-(--breakpoint-2xl) pt-5 pr-20 pl-20">
            <PrivateRoute allowedRoles={["ADMIN"]}>{children}</PrivateRoute>
          </div>
        </>
      ) : (
        /* ADMIN*/
        <div className="xl:flex">
          <AppSidebar />
          <div
            className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
          >
            <AppHeader />
            <div className="mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6">
              <PrivateRoute allowedRoles={["STOREOWNER", "STORESTAFF"]}>
                {children}
              </PrivateRoute>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
