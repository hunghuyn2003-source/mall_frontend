"use client";

import { getProfile } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/AuthSlide";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"ADMIN" | "STOREOWNER" | "STORESTAFF">;
}

export default function PrivateRoute({
  children,
  allowedRoles,
}: PrivateRouteProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const redirectedRef = useRef(false);

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: pathname !== "/signin" && !redirectedRef.current,
  });

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }

    if (
      isError &&
      (error as any)?.response?.status === 401 &&
      !redirectedRef.current
    ) {
      redirectedRef.current = true;
      router.replace("/signin");
    }
  }, [user, isError, error, dispatch, router]);

  if (isLoading) return null;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
