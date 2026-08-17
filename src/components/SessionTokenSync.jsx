"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { getAccessToken } from "@/lib/api";

export default function SessionTokenSync() {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending || typeof window === "undefined") return;

    if (!session?.user) {
      localStorage.removeItem("mediqueue-jwt");
      return;
    }

    getAccessToken({ force: true }).catch(() => {
      localStorage.removeItem("mediqueue-jwt");
    });
  }, [isPending, session?.user]);

  return null;
}
