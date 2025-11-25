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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-10 h-10 border-4 border-[#c46c39] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">
          Loading profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">
          Error loading profile: {error?.message || "Unknown error"}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">No profile data available</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div
          className="p-8 text-white"
          style={{
            background: "linear-gradient(135deg, #c46c39, #b3592c)",
          }}
        >
          <div className="flex items-center space-x-5">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-inner">
              <UserCircle2 className="w-16 h-16" />
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-wide">
                Admin Profile
              </h1>
              <p className="text-orange-100 text-sm mt-1">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-8 space-y-6">
          <h2
            className="text-xl font-semibold text-gray-800 mb-2 border-l-4 pl-3"
            style={{ borderColor: "#c46c39" }}
          >
            Personal Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex items-start space-x-4 bg-gray-50 p-5 rounded-xl shadow-sm hover:shadow-md transition">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: "#fde8da" }}
              >
                <User className="w-6 h-6" style={{ color: "#c46c39" }} />
              </div>

              <div>
                <p className="text-sm text-gray-500 font-medium">Full Name</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4 bg-gray-50 p-5 rounded-xl shadow-sm hover:shadow-md transition">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: "#fde8da" }}
              >
                <Mail className="w-6 h-6" style={{ color: "#c46c39" }} />
              </div>

              <div>
                <p className="text-sm text-gray-500 font-medium">Email</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-4 bg-gray-50 p-5 rounded-xl shadow-sm hover:shadow-md transition">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: "#fde8da" }}
              >
                <Phone className="w-6 h-6" style={{ color: "#c46c39" }} />
              </div>

              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Phone Number
                </p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {user.phoneNumber || "Not Provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
