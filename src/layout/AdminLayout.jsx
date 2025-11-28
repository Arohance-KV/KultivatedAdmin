import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/AuthSlice";
import {
  LayoutDashboard,
  Layers,
  Hash,
  Package,
  ShoppingBag,
  Percent,
  Monitor,
  Smartphone,
  Ticket,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Collection", path: "/admin/collection", icon: Layers },
    { name: "Category", path: "/admin/category", icon: Hash },
    { name: "Product", path: "/admin/product", icon: Package },
    { name: "Order", path: "/admin/order", icon: ShoppingBag },
    { name: "Discount", path: "/admin/discount", icon: Percent },
    { name: "Desktop Banner", path: "/admin/desktop-banner", icon: Monitor },
    { name: "Mobile Banner", path: "/admin/mobile-banner", icon: Smartphone },
    { name: "Voucher", path: "/admin/voucher", icon: Ticket },
    { name: "Blog", path: "/admin/blog", icon: FileText },
    { name: "Profile", path: "/admin/profile", icon: User },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isCollapsed ? "w-20" : "w-70"
        } bg-[#c16f35] text-white transition-all duration-300 flex flex-col shadow-2xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E1C6B3]">
          {!isCollapsed && (
            <h1 className="text-2xl font-bold tracking-wide">Kultivated Karats</h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-[#ce8b5b] transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-hidden py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-white text-[#b35512] shadow-lg"
                      : "hover:bg-[#b35512]"
                  }`
                }
                end={item.path === "/admin"} // important: dashboard active only on exact match
              >
                <Icon className="w-6 h-6" />
                {!isCollapsed && (
                  <span className="ml-4 font-medium">{item.name}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-[#E1C6B3]">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-red-500 transition-colors"
          >
            <LogOut className="w-6 h-6" />
            {!isCollapsed && <span className="ml-4 font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
