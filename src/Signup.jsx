import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI, verificationAPI } from './utils/api';
import { useTheme } from './contexts/ThemeContext';

export default function Signup({setUser}) {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');

//   const subjects = [
//     "Mathematics", "Physics", "Chemistry", "Biology", 
//     "English Language", "Economics", "Government", "Geography"
//   ];

//   const examTypes = [
//     { value: "WAEC", label: "WAEC - Senior Secondary Certificate" },
//     { value: "JAMB", label: "JAMB - University Entrance" },
//     { value: "100Level", label: "100Level - University First Year" }
//   

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
    }
    
    if (!formData.lastName) {
      newErrors.lastName = "Last Name is required";
    }
    
    // if (formData.subjects.length === 0) {
    //   newErrors.subjects = "Please select at least one subject";
    // }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions";
    }

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

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        agreeTerms: formData.agreeTerms
      };
      
      console.log('Sending userData:', userData);
      const response = await authAPI.register(userData);
      console.log('Registration successful:', response);
      
      // Show OTP verification screen
      setShowOTPVerification(true);
      setUserEmail(formData.email);
      setMessage(response.message || 'Registration successful! Please check your email for verification OTP.');
    } catch (err) {
      console.error('Authentication error:', err);
      setErrors({ submit: err.message || 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  const OTPVerification = ({ email, onVerified }) => {
    const [otp, setOtp] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState('');

    const verifyOTP = async () => {
      setOtpLoading(true);
      setOtpError('');
      try {
        await verificationAPI.verifyOTP(email, otp);
        onVerified();
      } catch (error) {
        setOtpError(error.message || 'Verification failed');
      }
      setOtpLoading(false);
    };

    const resendOTP = async () => {
      try {
        await verificationAPI.sendOTP(email);
        setMessage('New OTP sent to your email');
      } catch (error) {
        setOtpError('Failed to resend OTP');
      }
    };

    return (
      <div className="text-center">
        <div className="text-6xl mb-4">📧</div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">Verify Your Email</h2>
        <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Enter the 6-digit code sent to {email}</p>
        
        <div className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className={`w-full px-4 py-3 border rounded-lg text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              isDarkMode ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400" : "border-gray-300"
            }`}
            placeholder="000000"
            maxLength="6"
          />
          
          {otpError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{otpError}</p>
            </div>
          )}
          
          <button
            onClick={verifyOTP}
            disabled={otpLoading || otp.length !== 6}
            className="w-full bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {otpLoading ? 'Verifying...' : 'Verify Email'}
          </button>
          
          <button
            onClick={resendOTP}
            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
          >
            Resend OTP
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100'
    }`}>
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8 grid place-items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl tracking-tighter">CSC</span>
          </div>
          <h1 className={`text-3xl font-bold ${
            isDarkMode 
              ? 'text-white' 
              : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'
          }`}>
            Classence
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Nigerian Educational Testing Platform</p>
        </div>

        {/* Form Card */}
        <div className={`rounded-2xl shadow-xl p-8 border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          {/* Success Message */}
          {message && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm text-center">{message}</p>
            </div>
          )}

          {showOTPVerification ? (
            <OTPVerification 
              email={userEmail}
              onVerified={() => {
                setShowOTPVerification(false);
                navigate('/login', { state: { message: 'Email verified successfully! Please login to continue.' } });
              }}
            />
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Create Account</h2>
                <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Join thousands of Nigerian students</p>
              </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                  errors.firstName ? "border-red-500 bg-red-50" : isDarkMode ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400" : "border-gray-300"
                }`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                  errors.lastName ? "border-red-500 bg-red-50" : isDarkMode ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400" : "border-gray-300"
                }`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.lastName}</p>
              )}
            </div>

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
                  errors.email ? "border-red-500 bg-red-50" : isDarkMode ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400" : "border-gray-300"
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
                    errors.password ? "border-red-500 bg-red-50" : isDarkMode ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400" : "border-gray-300"
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

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 pr-12 ${
                    errors.confirmPassword ? "border-red-500 bg-red-50" : isDarkMode ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400" : "border-gray-300"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Exam Type Selection */}
            {/* <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Examination Type
              </label>
              <div className="space-y-3">
                {examTypes.map((exam) => (
                  <label key={exam.value} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="examType"
                      value={exam.value}
                      checked={formData.examType === exam.value}
                      onChange={handleInputChange}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="font-medium text-gray-800">{exam.value}</div>
                      <div className="text-xs text-gray-600">{exam.label}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.examType && (
                <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.examType}</p>
              )}
            </div> */}

            {/* Subject Selection */}
            {/* <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Subjects of Interest
              </label>
              <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                {subjects.map((subject) => (
                  <label key={subject} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      name="subjects"
                      value={subject}
                      checked={formData.subjects.includes(subject)}
                      onChange={handleInputChange}
                      className="text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <span className="text-sm text-gray-700">{subject}</span>
                  </label>
                ))}
              </div>
              {formData.subjects.length > 0 && (
                <div className="mt-2 text-xs text-gray-600">
                  Selected: {formData.subjects.join(", ")}
                </div>
              )}
              {errors.subjects && (
                <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.subjects}</p>
              )}
            </div> */}

            {/* Terms Agreement */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500 rounded"
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-800 underline">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-800 underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.agreeTerms}</p>
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
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-3">
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-indigo-600 hover:text-indigo-800 font-semibold underline"
              >
                Sign in here
              </button>
            </p>
          </div>
            </>
          )}
        </div>

        {/* Features Preview */}
        <div className="mt-8 text-center">
          <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>🇳🇬 Built for Nigerian Students</p>
          <div className={`flex justify-center space-x-6 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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