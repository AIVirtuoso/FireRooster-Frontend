import authService from "@/services/auth";
import { checkActiveTab } from "@/utils/utils";
import { Drawer } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  CreditCard,
  Filter,
  HelpCircle,
  LogOut,
  Menu,
  Radio,
  Settings,
  User,
} from "react-feather";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/store.hooks";
import { setPageInfo } from "@/store/slices/scanner.slice";

const MobileNavMenu = () => {
  const path = usePathname();
  const [openDrawer, setIsOpenDrawer] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogOut = async () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    router.push("/auth/login/");
  };

  const handleToggleDrawer = () => {
    setIsOpenDrawer((preVal) => !preVal);
  };

  return (
    <div className="nav-menu block lg:hidden w-full bg-gray-800 text-white flex items-center p-4">
      {/* Logo */}
      <Link href="/" className="mr-4">
        <img src="/white_logo.png" alt="Logo" className="h-12" />
      </Link>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Menu Button */}
      <button
        className="p-2 rounded-md focus:outline-none"
        onClick={handleToggleDrawer}
      >
        <Menu size={24} />
      </button>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={handleToggleDrawer}
        sx={{
          [`& .MuiDrawer-paper`]: {
            width: "80%",
            maxWidth: "300px",
            backgroundColor: "rgb(30, 41, 59)",
            color: "white",
          },
        }}
      >
        <div className="flex flex-col h-full">
          {/* Close Button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <span className="text-lg font-semibold">Menu</span>
            <button onClick={handleToggleDrawer} className="focus:outline-none">
              <Menu size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto">
            {/* Application Section */}
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 mt-6 mb-2">
                Application
              </h2>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/dashboard/alerts"
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      checkActiveTab(path, "alerts")
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={handleToggleDrawer}
                  >
                    <Bell className="mr-3" size={20} />
                    Alerts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/scanners"
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      checkActiveTab(path, "scanners")
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      dispatch(setPageInfo(null));
                      handleToggleDrawer();
                    }}
                  >
                    <Radio className="mr-3" size={20} />
                    Scanners
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/filter"
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      checkActiveTab(path, "filter")
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      dispatch(setPageInfo(null));
                      handleToggleDrawer();
                    }}
                  >
                    <Filter className="mr-3" size={20} />
                    Filter
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account Section */}
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 mb-2">
                Account
              </h2>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/dashboard/profile"
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      checkActiveTab(path, "profile")
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={handleToggleDrawer}
                  >
                    <User className="mr-3" size={20} />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/billing"
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      checkActiveTab(path, "billing")
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={handleToggleDrawer}
                  >
                    <CreditCard className="mr-3" size={20} />
                    Billing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/settings"
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      checkActiveTab(path, "settings")
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={handleToggleDrawer}
                  >
                    <Settings className="mr-3" size={20} />
                    Settings (Coming Soon)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Section */}
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 mb-2">
                Support
              </h2>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/dashboard/help"
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      checkActiveTab(path, "help")
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={handleToggleDrawer}
                  >
                    <HelpCircle className="mr-3" size={20} />
                    Help Center (Coming Soon)
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t border-gray-700">
            <button
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-500 hover:text-red-400 hover:bg-gray-700 rounded-md focus:outline-none"
              onClick={() => {
                handleLogOut();
                handleToggleDrawer();
              }}
            >
              <LogOut className="mr-3" size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default MobileNavMenu;
