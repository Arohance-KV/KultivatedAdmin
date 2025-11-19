import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Mail, Phone, Lock } from "lucide-react";

export default function AdminSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.email || !formData.password) {
      setError("Please fill all required fields.");
      return;
    }

    localStorage.setItem("adminProfile", JSON.stringify(formData));
    navigate("/");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-gray-100 to-gray-200 p-6">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-10 border border-gray-100">

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#E1C6B3] p-4 rounded-full shadow-md">
            <UserPlus size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mt-4 text-gray-800">Create Admin Account</h2>
          <p className="text-gray-500 text-center mt-1">
            Join and manage your dashboard smoothly.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">

          {/* First Name */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-600">First Name *</label>
            <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl border">
              <UserPlus className="text-gray-500" size={18} />
              <input
                type="text"
                name="firstName"
                placeholder="Enter first name"
                className="bg-transparent w-full outline-none"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-600">Last Name</label>
            <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl border">
              <UserPlus className="text-gray-500" size={18} />
              <input
                type="text"
                name="lastName"
                placeholder="Enter last name"
                className="bg-transparent w-full outline-none"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-600">Email *</label>
            <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl border">
              <Mail className="text-gray-500" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                className="bg-transparent w-full outline-none"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-600">Phone Number</label>
            <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl border">
              <Phone className="text-gray-500" size={18} />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Enter phone number"
                className="bg-transparent w-full outline-none"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-600">Password *</label>
            <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl border">
              <Lock className="text-gray-500" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                className="bg-transparent w-full outline-none"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#E1C6B3] text-white font-semibold py-3 rounded-xl shadow-md hover:bg-[#d9b39f] transition"
          >
            Create Account
          </button>

        </form>

        {/* Login Redirect */}
        <p className="text-center mt-5 text-gray-600">
          Already have an account?{" "}
          <span
            className="text-[#E1C6B3] font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}
