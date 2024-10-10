import authService from "@/services/auth";
import { checkActiveTab } from "@/utils/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CreditCard,
  Filter,
  LogOut,
  Radio,
  User,
  Settings,
  HelpCircle,
} from "react-feather";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/store.hooks";
import { setPageInfo } from "@/store/slices/scanner.slice";

const Navmenu = () => {
  const path = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogOut = async () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    router.push("/auth/login/");
  };

  return (
    <div className="nav-menu hidden lg:flex bg-gray-800 text-white flex-col p-6">
      {/* Logo */}
      <div className="flex items-center justify-center mb-8">
        <img src={"/white_logo.png"} alt="Logo" className="w-32 h-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        {/* Application Section */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
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
              >
                <Bell className="mr-3" size={20} />
                Alerts
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/scanners"
                onClick={() => dispatch(setPageInfo(null))}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  checkActiveTab(path, "scanners")
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                <Radio className="mr-3" size={20} />
                Scanners
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/filter"
                onClick={() => dispatch(setPageInfo(null))}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  checkActiveTab(path, "filter")
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                <Filter className="mr-3" size={20} />
                Filter
              </Link>
            </li>
          </ul>
        </div>

        {/* Account Section */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
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
              >
                <CreditCard className="mr-3" size={20} />
                Billing
              </Link>
            </li>
            <li>
              <Link
                // href="/dashboard/settings"
                href="#"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  checkActiveTab(path, "settings")
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                <Settings className="mr-3" size={20} />
                Settings (Coming Soon)
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Support
          </h2>
          <ul className="space-y-1">
            <li>
              <Link
                // href="/dashboard/help"
                href="#"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  checkActiveTab(path, "help")
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                <HelpCircle className="mr-3" size={20} />
                Help Center (Coming Soon)
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Sign Out */}
      <div className="mt-auto">
        <button
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-gray-700 rounded-md"
          onClick={handleLogOut}
        >
          <LogOut className="mr-3" size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Navmenu;
