"use client";

import { getProfile } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  useEffect(() => {
    if (isError) {
      router.replace("/signin");
    }
  }, [isError, router]);

  if (isLoading) return null;

  return <>{children}</>;
}
