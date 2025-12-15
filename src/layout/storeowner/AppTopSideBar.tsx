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

import { useProfile } from "@/hooks/useProfile";
import { logout } from "@/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const MENU_STORESTAFF = [
  {
    label: "Bán Hàng",
    href: "/store/sale",
    icon: LayoutDashboard,
  },
  {
    label: "Lịch sử",
    href: "/store/history",
    icon: Package,
  },
  {
    label: "Lịch Làm",
    href: "/store/schedule",
    icon: CalendarDays,
  },
];

const MENU_STOREOWNER = [
  {
    label: "Thống kê",
    href: "/store/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Sản phẩm",
    href: "/store/products",
    icon: Package,
  },
  {
    label: "Nhân viên",
    href: "/store/staff",
    icon: Users,
  },
  {
    label: "Xếp lịch làm",
    href: "/store/scheduling",
    icon: CalendarDays,
  },
  {
    label: "Chat",
    href: "/store/chat",
    icon: MessageSquare,
  },
];

export default function AppTopSideBar() {
  const { data: user } = useProfile();
  const pathname = usePathname();

  const router = useRouter();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      router.push("/signin");
    },
  });

  // Chọn menu theo role
  let menu = MENU_STOREOWNER;
  if (user?.role === "STORESTAFF") {
    menu = MENU_STORESTAFF;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      {/* TOP BAR */}
      <div className="flex h-16 items-center justify-between px-8">
        {/* LEFT - LOGO */}
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-semibold text-gray-800">
            {user?.stores?.[0]?.name}
          </span>
        </div>

        {/* RIGHT - USER */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 text-sm text-gray-700 sm:flex">
            <User className="h-4 w-4" />
            <span className="font-medium">{user?.name}</span>
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
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  } `}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
