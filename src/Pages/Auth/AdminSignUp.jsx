import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../redux/AuthSlice";
import { UserPlus, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";

export default function AdminSignup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // VALIDATION FUNCTIONS
  const validateName = (name) => /^[A-Za-z]{2,}$/.test(name);
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) =>
    /^[0-9]{10}$/.test(phone);
  const validatePassword = (password) => password.length >= 6;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // First name validation
    if (!validateName(formData.firstName)) {
      setLocalError("First name must contain only letters & be at least 2 characters.");
      return;
    }

    // Email validation
    if (!validateEmail(formData.email)) {
      setLocalError("Please enter a valid email address.");
      return;
    }

    // Phone validation (optional field)
    if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) {
      setLocalError("Phone number must be 10 digits only.");
      return;
    }

    // Password validation
    if (!validatePassword(formData.password)) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await dispatch(signup(formData)).unwrap();
    } catch (err) {
      setLocalError(err.message || "Signup failed");
    }
  };

  useEffect(() => {
    if (success) {
      navigate("/");
    }
  }, [success, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-purple-50 to-pink-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl ">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <UserPlus className="w-16 h-16 text-[#ce8b5b]" />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Admin Signup
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Join and manage your dashboard smoothly.
        </p>

        {(localError || error) && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {localError || error?.message || "An error occurred"}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSignup} className="space-y-4">

          {/* NAME FIELDS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* EMAIL FIELD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* PHONE FIELD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* PASSWORD FIELD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={loading}
              />

              {/* EYE ICON */}
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </span>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#ce8b5b] text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-[#ce8b5b] font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
