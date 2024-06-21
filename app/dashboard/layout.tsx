"use client";
import MobileNavMenu from "@/components/mobile-nav-menu";
import Navmenu from "@/components/navmenu";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = usePathname();
  // console.log(router);
  return (
    <div className="flex-none lg:flex h-screen lg:flex-1">
      <MobileNavMenu />
      <Navmenu />
      <div className="flex flex-1 p-8 overflow-hidden justify-center">
        <div className="max-w-screen-2xl flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
