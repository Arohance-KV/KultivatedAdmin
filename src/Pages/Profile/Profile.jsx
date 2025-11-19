import React, { useEffect, useState } from "react";
import { User, Mail, Phone, UserCircle2 } from "lucide-react";

export default function Profile() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    // Load admin data from localStorage
    const savedData = localStorage.getItem("adminProfile");

    if (savedData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAdmin(JSON.parse(savedData));
    }
  }, []);

  if (!admin) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        No profile found. Please login first.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-start py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl border border-gray-200">

        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#E1C6B3] w-28 h-28 rounded-full flex justify-center items-center shadow-md">
            <UserCircle2 size={70} className="text-white" />
          </div>
          <h1 className="text-2xl font-semibold mt-4">
            {admin.firstName} {admin.lastName}
          </h1>
          <p className="text-gray-500">{admin.email}</p>
        </div>

        {/* Details */}
        <div className="space-y-5">

          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100">
            <User size={20} className="text-gray-600" />
            <div>
              <p className="text-gray-600 text-sm">Full Name</p>
              <p className="font-medium">
                {admin.firstName} {admin.lastName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100">
            <Mail size={20} className="text-gray-600" />
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="font-medium">{admin.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 p rounded-lg bg-gray-100">
            <Phone size={20} className="text-gray-600" />
            <div>
              <p className="text-gray-600 text-sm">Phone Number</p>
              <p className="font-medium">{admin.phoneNumber}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
