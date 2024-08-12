import authService from "@/services/auth";
import { checkActiveTab } from "@/utils/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CreditCard, Filter, LogOut, Radio, User } from "react-feather";
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
    // await authService.logOut().then(() => {

    // });
  };

  return (
    <div className="nav-menu hidden lg:flex max-w-xs w-80 bg-gray-900 text-white flex flex-col p-8">
      <div className="pb-4 mb-8">Company logo</div>
      <p className="mb-2 text-gray-600">Application</p>
      <ul className="mb-8">
        <li>
          <Link
            href="/dashboard/alerts"
            className={`p-2 flex items-center ${
              checkActiveTab(path, "alerts") ? "bg-gray-700 rounded-md" : ""
            }`}
          >
            <Bell className="me-4" size={18} /> Alerts
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/scanners"
            onClick={() => dispatch(setPageInfo(null))}
            className={`p-2 flex items-center ${
              checkActiveTab(path, "scanners") ? "bg-gray-700 rounded-md" : ""
            }`}
          >
            <Radio className="me-4" size={18} /> Scanners
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/filter"
            onClick={() => dispatch(setPageInfo(null))}
            className={`p-2 flex items-center ${
              checkActiveTab(path, "filter") ? "bg-gray-700 rounded-md" : ""
            }`}
          >
            <Filter className="me-4" size={18} /> Filter
          </Link>
        </li>
      </ul>
      <p className="mb-2 text-gray-600">Account</p>
      <ul className="mb-8">
        <li>
          <Link
            href="/dashboard/profile"
            className={`p-2 flex items-center ${
              checkActiveTab(path, "profile") ? "bg-gray-700 rounded-md" : ""
            }`}
          >
            <User className="me-4" size={18} /> Profile
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/billing"
            className={`p-2 flex items-center ${
              checkActiveTab(path, "billing") ? "bg-gray-700 rounded-md" : ""
            }`}
          >
            <CreditCard className="me-4" size={18} /> Billing
          </Link>
        </li>
      </ul>
      <button className="mt-auto flex items-center" onClick={handleLogOut}>
        <LogOut className="me-4" size={18} /> Sign out
      </button>
    </div>
  );
};

export default Navmenu;
