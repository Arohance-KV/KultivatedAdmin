import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function DashboardHome() {
  const BRAND = "#c28356";

  const stats = [
    { label: "Total Collections", value: 12, change: "+15%", icon: "💎" },
    { label: "Active Products", value: 245, change: "+8%", icon: "🛍️" },
    { label: "Recent Orders", value: 34, change: "-2%", icon: "📦" },
    { label: "Revenue This Month", value: "₹12,450", change: "+22%", icon: "💰" },
  ];

  const barData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 4500 },
    { month: "May", sales: 6000 },
    { month: "Jun", sales: 5500 },
  ];

  const pieData = [
    { name: "Gold", value: 400, color: "#FFD700" },
    { name: "Silver", value: 300, color: "#C0C0C0" },
    { name: "Diamond", value: 200, color: "#B9F2FF" },
    { name: "Gemstone", value: 100, color: "#FF69B4" },
  ];

  return (
    <div
      className="p-8"
      style={{
        background: "linear-gradient(135deg, #f2e8df, #ffffff)",
        minHeight: "100vh",
      }}
    >
      {/* GLASS HEADING */}
      <div
        className="flex justify-between items-center mb-10 p-5 rounded-2xl shadow-xl border"
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(14px)",
          borderColor: "rgba(255,255,255,0.35)",
        }}
      >
        <h1 className="text-4xl font-bold text-[#c28356] tracking-wide drop-shadow-sm">
          KK Admin Dashboard
        </h1>

        <span
          className="px-5 py-2 rounded-xl text-white font-semibold shadow-md"
          style={{ background: BRAND }}
        >
          Overview
        </span>
      </div>

      {/* STATS CARDS — GLASS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl shadow-lg border transition hover:shadow-2xl"
            style={{
              background: "rgba(255,255,255,0.50)",
              backdropFilter: "blur(12px)",
              borderColor: "rgba(255,255,255,0.3)",
            }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm font-medium">{s.label}</p>
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                <p
                  className={`text-sm font-semibold ${
                    s.change.startsWith("+") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {s.change} vs last month
                </p>
              </div>
              <span className="text-4xl">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Bar Chart Card — GLASS */}
        <div
          className="p-6 rounded-2xl shadow-xl border"
          style={{
            background: "rgba(255,255,255,0.50)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(255,255,255,0.3)",
          }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Monthly Sales
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: "12px" }} />
              <Bar dataKey="sales" fill={BRAND} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart Card — GLASS */}
        <div
          className="p-6 rounded-2xl shadow-xl border"
          style={{
            background: "rgba(255,255,255,0.50)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(255,255,255,0.3)",
          }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Product Categories
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT ACTIVITY — GLASS */}
      <div
        className="p-6 rounded-2xl shadow-xl border"
        style={{
          background: "rgba(255,255,255,0.50)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.3)",
        }}
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Activity
        </h3>

        <ul className="space-y-2 text-sm text-gray-700">
          <li>• New collection "Summer Gems" added</li>
          <li>• Order #1234 shipped</li>
          <li>• Discount code "JEWEL20" activated</li>
          <li>• 5 new products uploaded</li>
        </ul>
      </div>
    </div>
  );
}
