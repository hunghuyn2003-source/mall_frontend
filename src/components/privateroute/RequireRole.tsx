import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RequireRoleProps {
  allowedRoles: string[];
  children: React.ReactNode;
  redirectTo?: string;
}

export default function RequireRole({
  allowedRoles,
  children,
  redirectTo = "/signin",
}: RequireRoleProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      router.replace(redirectTo);
    }
  }, [user, allowedRoles, router, redirectTo]);

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
