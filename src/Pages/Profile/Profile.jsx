import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../redux/AuthSlice";
import { User, Mail, Phone, UserCircle2 } from "lucide-react";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const BRAND = "#c28356";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-white to-orange-50">
        <div
          className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: BRAND }}
        ></div>
        <p className="mt-4 text-lg font-medium text-gray-700">
          Loading profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-red-600">
        Error loading profile: {error?.message || "Unknown error"}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-600">
        No profile data available
      </div>
    );
  }

  return (
    <div
      className="max-w-4xl mx-auto p-8"
      style={{
        background: "linear-gradient(135deg, #f2e8df, #ffffff)",
        minHeight: "100vh",
      }}
    >
      {/* Glassmorphism Wrapper */}
      <div
        className="rounded-2xl shadow-xl overflow-hidden border"
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(14px)",
          borderColor: "rgba(255,255,255,0.35)",
        }}
      >
        {/* Header */}
        <div
          className="p-8 text-white flex items-center space-x-6"
          style={{
            background: `linear-gradient(135deg, ${BRAND}, #a86a41)`,
          }}
        >
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-inner">
            <UserCircle2 className="w-20 h-20" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-wide">Admin Profile</h1>
            <p className="text-orange-100 text-sm mt-1">{user.email}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          <h2
            className="text-xl font-semibold text-gray-800 mb-3 border-l-4 pl-3"
            style={{ borderColor: BRAND }}
          >
            Personal Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <GlassItem
              icon={<User className="w-6 h-6" style={{ color: BRAND }} />}
              label="Full Name"
              value={`${user.firstName} ${user.lastName}`}
            />

            {/* Email */}
            <GlassItem
              icon={<Mail className="w-6 h-6" style={{ color: BRAND }} />}
              label="Email"
              value={user.email}
            />

            {/* Phone */}
            <GlassItem
              icon={<Phone className="w-6 h-6" style={{ color: BRAND }} />}
              label="Phone Number"
              value={user.phoneNumber || "Not Provided"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Glass Card Component ---------------- */

const GlassItem = ({ icon, label, value }) => {
  return (
    <div
      className="flex items-start space-x-4 p-5 rounded-xl shadow-md transition hover:shadow-xl"
      style={{
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.3)",
      }}
    >
      <div
        className="p-3 rounded-lg shadow"
        style={{ backgroundColor: "#f9e6d7" }}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
};
