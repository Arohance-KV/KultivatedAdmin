// src/Components/DashboardHome.jsx (No changes needed; already set up for admin context)
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'; // npm install recharts

const DashboardHome = () => {
  // Demo data for jewelry dashboard
  const stats = [
    { label: 'Total Collections', value: 12, change: '+15%', icon: '💎' },
    { label: 'Active Products', value: 245, change: '+8%', icon: '🔗' },
    { label: 'Recent Orders', value: 34, change: '-2%', icon: '📦' },
    { label: 'Revenue This Month', value: '$12,450', change: '+22%', icon: '💰' },
  ];

  const barData = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4500 },
    { month: 'May', sales: 6000 },
    { month: 'Jun', sales: 5500 },
  ];

  const pieData = [
    { name: 'Gold', value: 400, color: '#FFD700' },
    { name: 'Silver', value: 300, color: '#C0C0C0' },
    { name: 'Diamond', value: 200, color: '#B9F2FF' },
    { name: 'Gemstone', value: 100, color: '#FF69B4' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-gray-800">KK Admin Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#E1C6B3]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#E1C6B3" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Product Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions or Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• New collection "Summer Gems" added by Admin</li>
          <li>• Order #1234 shipped</li>
          <li>• Discount code "JEWEL20" activated</li>
          <li>• 5 new products uploaded</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardHome;