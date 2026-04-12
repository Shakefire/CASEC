"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Role, useMockAuth } from "@/lib/auth";

interface PrivateRouteProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export default function PrivateRoute({ allowedRoles, children }: PrivateRouteProps) {
  const { role } = useMockAuth();
  const router = useRouter();

  useEffect(() => {
    if (role && !allowedRoles.includes(role)) {
      router.replace("/");
    }
  }, [role, allowedRoles, router]);

  if (!role || !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
