"use client";

import React, { useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";

import AppStaffTopSideBar from "@/layout/staff/AppStaffTopSideBar";
import PrivateRoute from "@/components/privateroute/PrivateRoute";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setActiveStore } from "@/store/StoreSlice";
import CircularProgress from "@mui/material/CircularProgress";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user?.stores[0]);

  useEffect(() => {
    if (user?.stores && user.stores.length >= 1) {
      dispatch(setActiveStore(user.stores[0] as any));
    }
  }, [user, dispatch]);

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-30 lg:mr-30 mt-4"
      : "lg:ml-[90px] lg:mr-[90px]";

  return (
    <div className="min-h-screen">
      <PrivateRoute allowedRoles={["STORESTAFF"]}>
        <AppStaffTopSideBar />
        <div
          className={`mx-auto max-w-(--breakpoint-2xl) pt-5 ${mainContentMargin}`}
        >
          {children}
        </div>
      </PrivateRoute>
    </div>
  );
}
