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
  RefreshCw,
  Receipt,
} from "lucide-react";
import { ROLE_LABEL } from "@/helper/Label";
import { useState, useRef, useEffect } from "react";
import { setActiveStore } from "@/store/StoreSlice";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useDispatch } from "react-redux";
import { persistor } from "@/store";
import { clearUser } from "@/store/AuthSlide";
import { clearActiveStore } from "@/store/StoreSlice";
import { logout } from "@/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const MENU_STOREOWNER = [
  {
    icon: <LayoutDashboard size={20} />,
    name: "Thống kê",
    path: "/store/dashboard",
  },
  { icon: <Package size={20} />, name: "Sản phẩm", path: "/store/product" },
  { icon: <Users size={20} />, name: "Nhân viên", path: "/store/staff" },
  {
    icon: <Receipt size={20} />,
    name: "Lịch sử hóa đơn",
    path: "/store/history",
  },
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

  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setStoreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitchStore = (newStore: any) => {
    dispatch(clearActiveStore());
    queryClient.clear();
    dispatch(setActiveStore(newStore));
    setStoreDropdownOpen(false);
  };

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

  const menu = MENU_STOREOWNER;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      {/* TOP BAR */}
      <div className="flex h-16 items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <Store className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-semibold text-gray-800">
            {store?.name}
          </span>

          {user?.stores && user.stores.length > 1 && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
                className="flex items-center justify-center rounded-lg border p-2 hover:bg-gray-100"
                title="Chuyển cửa hàng"
              >
                <RefreshCw className="h-4 w-4 text-gray-600" />
              </button>

              {storeDropdownOpen && (
                <div className="absolute top-full left-0 z-50 mt-1 min-w-[200px] rounded-lg border bg-white py-1 shadow-lg">
                  {user.stores.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSwitchStore(s)}
                      className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                        store?.id === s.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      <Store className="h-4 w-4" />
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            {ROLE_LABEL[user.role] || user.role}
          </span>

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
