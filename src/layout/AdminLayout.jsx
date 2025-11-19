import React, { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  // ⭐ Sidebar Menu Items
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

  // ⭐ Active Highlight Logic (supports nested routes)
  const isActivePath = (path) =>
    location.pathname === path || location.pathname.startsWith(path);

  // ⭐ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-[#E1C6B3] overflow-hidden">
      {/* SIDEBAR */}
      <div
        className={`relative bg-[#E1C6B3] p-4 transition-all duration-300 ease-in-out flex flex-col shadow-lg ${
          isCollapsed ? "w-30" : "w-70"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Kaltivated Karats 
            </h1>
          )}

          <button
            onClick={toggleSidebar}
            className="text-white hover:bg-white/20 p-1 rounded-lg transition"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(item.path);

              return (
                <li key={item.name} className="relative group">
                  <NavLink
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
                      ${
                        active
                          ? "bg-white/40 text-[#4A2E22] font-semibold shadow-sm"
                          : "text-white hover:bg-white/20"
                      }
                    `}
                  >
                    <Icon
                      size={20}
                      className={`${active ? "text-[#4A2E22]" : "text-white"}`}
                    />

                    {!isCollapsed && (
                      <span
                        className={`text-sm ${
                          active ? "text-[#4A2E22]" : "text-white"
                        }`}
                      >
                        {item.name}
                      </span>
                    )}
                  </NavLink>

                  {/* ⭐ Tooltip (Visible only when collapsed) */}
                  {isCollapsed && (
                    <span
                      className="absolute left-14 top-1/2 opacity-0 group-hover:opacity-100 
                      -translate-y-1/2 px-3 py-1 bg-black text-white text-xs 
                      rounded shadow-lg whitespace-nowrap transition-opacity duration-200"
                    >
                      {item.name}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* FOOTER - LOGOUT BUTTON */}
        <div className="mt-5">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-all 
              text-white hover:bg-red-500/60`}
          >
            <LogOut size={20} />

            {!isCollapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>

        {/* Tooltip for Logout */}
        {isCollapsed && (
          <span
            className="absolute left-14 bottom-8 opacity-0 group-hover:opacity-100 
            px-3 py-1 bg-black text-white text-xs rounded shadow-lg 
            whitespace-nowrap transition-opacity duration-200"
          >
            Logout
          </span>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-white p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
