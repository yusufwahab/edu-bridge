import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import YabvilPrepLogo from './Yabvilprep-logo.png'

export default function Login({setUser}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const BASE_URL = 'https://edubridge-backend-thgw.onrender.com';
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await axios.post(`${BASE_URL}/api/user/login`, formData);
      localStorage.setItem('token', res.data.token);
      console.log('Authentication successful:', res.data);
      setUser(res.data.user);
      
      // Check if user has completed onboarding
      const onboardingData = localStorage.getItem('onboardingData');
      if (!onboardingData || !JSON.parse(onboardingData).onboardingCompleted) {
        navigate('/onboarding/welcome');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      alert(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8 grid place-items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl tracking-tighter">CSC</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
            Classence CBT
          </h1>
          <p className="text-gray-600 mt-2">Nigerian Educational Testing Platform</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Welcome Back</h2>
            <p className="text-gray-600 mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                  errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 pr-12 ${
                    errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.password}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-3">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold underline"
                >
                  Sign up here
                </button>
              </p>
              <p className="text-sm">
                <a href="#" className="text-gray-500 hover:text-gray-700 underline">
                  Forgot your password?
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">🇳🇬 Built for Nigerian Students</p>
          <div className="flex justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span>✅</span> WAEC Standard
            </div>
            <div className="flex items-center gap-1">
              <span>✅</span> JAMB Format
            </div>
            <div className="flex items-center gap-1">
              <span>✅</span> 100Level Ready
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}