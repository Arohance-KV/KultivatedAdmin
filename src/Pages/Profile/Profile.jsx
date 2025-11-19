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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading profile...</div>
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
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-500 to-purple-600 p-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <UserCircle2 className="w-16 h-16" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Profile</h1>
              <p className="text-indigo-100 mt-1">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Full Name</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Email Address</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-start space-x-4">
              <div className="bg-pink-100 p-3 rounded-lg">
                <Phone className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">
                  {user.phoneNumber || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
