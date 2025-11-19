import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();

  const STATIC_ADMIN = {
    email: "admin@example.com",
    password: "123456",
    firstName: "Rahul",
    lastName: "Paswan",
    phoneNumber: "9876543210",
  };

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      formData.email === STATIC_ADMIN.email &&
      formData.password === STATIC_ADMIN.password
    ) {
      localStorage.setItem("adminProfile", JSON.stringify(STATIC_ADMIN));
      navigate("/admin");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-gray-100 to-gray-200 p-6">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-10 border">

        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#E1C6B3] p-4 rounded-full shadow-md">
            <LogIn size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mt-4 text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-center">Login to your admin panel</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-gray-600">Email</label>
            <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl border mt-1">
              <Mail className="text-gray-500" size={18} />
              <input
                type="email"
                name="email"
                className="bg-transparent w-full outline-none"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-600">Password</label>
            <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl border mt-1">
              <Lock className="text-gray-500" size={18} />
              <input
                type="password"
                name="password"
                className="bg-transparent w-full outline-none"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#E1C6B3] text-white font-semibold py-3 rounded-xl hover:bg-[#d9b39f]"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-5 text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-[#E1C6B3] cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
}
