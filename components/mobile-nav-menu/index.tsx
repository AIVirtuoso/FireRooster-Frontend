import authService from "@/services/auth";
import { checkActiveTab } from "@/utils/utils";
import { Drawer } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, CreditCard, LogOut, Menu, Radio, User } from "react-feather";
import { useRouter } from "next/navigation";

const MobileNavMenu = () => {
  const path = usePathname();
  const [openDrawer, setIsOpenDrawer] = useState(false);
  const router = useRouter();

  const handleLogOut = async () => {
    localStorage.removeItem("auth");
    router.push("/auth/login/");
    // await authService.logOut().then(() => {
      
    // });
  };
  const handleToggleDrawer = () => {
    setIsOpenDrawer((preVal) => !preVal);
  };

  return (
    <div className="nav-menu block lg:hidden w-full bg-gray-900 text-white flex p-8">
      <ul className="flex">
        <li>
          <Link
            href="/dashboard/alerts"
            className={`p-2 flex items-center ${
              checkActiveTab(path, "alerts") ? "bg-gray-700 rounded-md" : ""
            }`}
          >
            <Bell className="me-2" size={18} /> Alerts
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/scanners"
            className={`p-2 flex items-center ${
              checkActiveTab(path, "scanners") ? "bg-gray-700 rounded-md" : ""
            }`}
          >
            <Radio className="me-2" size={18} /> Scanners
          </Link>
        </li>
      </ul>
      <button
        className="p-2 bg-gray-700 rounded-md ms-auto"
        onClick={handleToggleDrawer}
      >
        <Menu className="items-center" size={18} />
      </button>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={handleToggleDrawer}
        sx={{
          [`& .MuiDrawer-paper`]: {
            width: "100%",
            maxWidth: "260px",
            padding: "10px",
            backgroundColor: "rgb(30, 41, 59)",
          },
        }}
      >
        <div className="flex flex-col flex-1">
          <ul className="ms-4">
            <li className="mt-4">
              <h5 className="mb-6 lg:mb-3 font-semibold text-slate-900 dark:text-slate-200">
                Account
              </h5>
              <ul className="space-y-6 lg:space-y-2 border-l border-slate-100 dark:border-slate-700">
                <li>
                  <Link
                    href="/dashboard/profile"
                    className={`block border-l pl-4 -ml-px border-transparent flex items-center 
                      ${
                        checkActiveTab(path, "profile")
                          ? "border-slate-500 text-slate-300 "
                          : "dark:text-slate-400 text-slate-700"
                      }
                      hover:border-slate-400 dark:hover:border-slate-500 
                      hover:text-slate-900 dark:hover:text-slate-300
                      `}
                    onClick={handleToggleDrawer}
                  >
                    <User className="me-2" size={18} /> Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/billing"
                    className={`block border-l pl-4 -ml-px border-transparent flex items-center 
                    ${
                      checkActiveTab(path, "billing")
                        ? "border-slate-500 text-slate-300 "
                        : "dark:text-slate-400 text-slate-700"
                    }
                    hover:border-slate-400 dark:hover:border-slate-500 
                    hover:text-slate-900 dark:hover:text-slate-300
                    `}
                    onClick={handleToggleDrawer}
                  >
                    <CreditCard className="me-2" size={18} /> Billing
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
          <button
            className="ms-4 mt-auto mb-6 lg:mb-3 flex items-center p-2 font-semibold text-slate-900 dark:text-slate-200 hover:bg-gray-700 rounded-md text-start"
            onClick={handleLogOut}
          >
            <LogOut className="me-2 items-center" size={18} />
            Sign out
          </button>
        </div>
      </Drawer>
    </div>
  );
};

export default MobileNavMenu;
