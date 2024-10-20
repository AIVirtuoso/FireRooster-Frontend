// app/components/ClientLayout.tsx
"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import StoreProvider from "@/store/StoreProvider";
import { useCheckAuth } from "@/hooks/useCheckAuth";
import { useEffect } from "react";
import accountService from "@/services/account";
import { useRouter } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const fetchProfile = async () => {
    console.log("here")
    try {
        const resp = await accountService.getProfile();
        return;
      } catch (e: any) {
        if (e.response && e.response.status === 401) {
          console.error("Unauthorized - 401 (Caught in Catch Block)");
          router.push("/auth/login"); // Redirect to login page
        } else {
          console.error("An error occurred:", e);
        }
      }
    console.log("end")
  }
  useEffect(() => {
    fetchProfile()
  }, [])

  return (
    <StoreProvider>
      <AppRouterCacheProvider>
        {children}
      </AppRouterCacheProvider>
    </StoreProvider>
  );
}
