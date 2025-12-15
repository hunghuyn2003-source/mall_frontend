"use client";

import { getProfile } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"ADMIN" | "STOREOWNER" | "STORESTAFF">;
}

export default function PrivateRoute({
  children,
  allowedRoles,
}: PrivateRouteProps) {
  const router = useRouter();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isError) {
      router.replace("/signin");
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace("/");
    }
  }, [isError, user, allowedRoles, router]);

  if (isLoading) return null;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
