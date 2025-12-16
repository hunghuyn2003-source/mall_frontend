"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  User,
  Store,
  LayoutDashboard,
  Package,
  Users,
  CalendarDays,
  MessageSquare,
} from "lucide-react";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useDispatch } from "react-redux";
import { persistor } from "@/store";
import { clearUser } from "@/store/AuthSlide";
import { clearActiveStore } from "@/store/StoreSlice";
import { logout } from "@/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const MENU_STORESTAFF = [
  {
    icon: <LayoutDashboard size={20} />,
    name: "Bán Hàng",
    path: "/store/sale",
  },
  { icon: <Package size={20} />, name: "Lịch sử", path: "/store/history" },
  {
    icon: <CalendarDays size={20} />,
    name: "Lịch Làm",
    path: "/store/schedule",
  },
];

const MENU_STOREOWNER = [
  { icon: <LayoutDashboard size={20} />, name: "Thống kê", path: "/dashboard" },
  { icon: <Package size={20} />, name: "Sản phẩm", path: "/store/products" },
  { icon: <Users size={20} />, name: "Nhân viên", path: "/store/staff" },
  {
    icon: <CalendarDays size={20} />,
    name: "Xếp lịch làm",
    path: "/store/scheduling",
  },
  { icon: <MessageSquare size={20} />, name: "Chat", path: "/store/chat" },
];

export default function AppTopSideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const store = useSelector((state: RootState) => state.store.activeStore);

  const user = useSelector((state: RootState) => state.auth.user);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      persistor.purge();
      dispatch(clearUser());
      dispatch(clearActiveStore());
      queryClient.clear();
      router.push("/signin");
    },
  });

  if (!user) return null;

  const menu = store?.role === "STAFF" ? MENU_STORESTAFF : MENU_STOREOWNER;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      {/* TOP BAR */}
      <div className="flex h-16 items-center justify-between px-8">
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-semibold text-gray-800">
            {store?.name}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 text-sm text-gray-700 sm:flex">
            <User className="h-4 w-4" />
            <span className="font-medium">{user.name}</span>
          </div>

          <button
            onClick={() => logoutMutation.mutate()}
            className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:block">Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* MENU BAR */}
      <nav className="border-t bg-white">
        <ul className="flex items-center gap-1 px-4 md:px-6">
          {menu.map((item) => {
            const active = pathname.startsWith(item.path);
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
