import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Users, MapPin, Clock, MessageSquare, CheckCircle, UserCheck, Settings, ExternalLink } from 'lucide-react';

const AttendancePage = () => {
  const { isDarkMode } = useTheme();

  const handleTestAttendance = () => {
    window.open('https://classence-frontend.vercel.app', '_blank');
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl sm:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>
            Smart Attendance System
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage class attendance with geolocation tracking and real-time updates
          </p>
        </div>

        {/* Teacher Section */}
        <div className={`rounded-xl shadow-sm border p-6 mb-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>For Teachers & Administrators</h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Create and manage your classes with advanced attendance tracking</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>📚 Class Management</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-blue-700'}`}>
                Create departments, classes, and subjects. Register students and manage their profiles easily.
              </p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
              <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-green-900'}`}>📍 Location Tracking</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-green-700'}`}>
                Set class locations and ensure students can only mark attendance when physically present.
              </p>
            </div>
          </div>

          <button
            onClick={handleTestAttendance}
            className="w-full bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white py-3 px-6 rounded-lg font-semibold hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800 transition-all flex items-center justify-center gap-2"
          >
            <span>Create Classes & Register Students</span>
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>

        {/* How It Works */}
        <div className={`rounded-xl shadow-sm border p-6 mb-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>How It Works</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Admin Steps */}
            <div>
              <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <UserCheck className="w-6 h-6 text-blue-600" />
                For Teachers/Admins
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create Department/Class</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Set up your department or class with relevant details</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add Subjects & Sessions</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Create subjects and schedule attendance sessions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Set Location Parameters</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Define the physical location where attendance can be marked</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Post Updates</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Share announcements with voice notes, text, or images</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Steps */}
            <div>
              <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Users className="w-6 h-6 text-green-600" />
                For Students
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sign Up</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Register with name and matric number</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Choose Department</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Select your class/department from dropdown</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Access Dashboard</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>View available sessions and class updates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mark Attendance</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>One-click attendance marking (location verified)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className={`rounded-xl shadow-sm border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Geolocation Tracking</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Students can only mark attendance when physically present at the designated class location.
            </p>
          </div>

          <div className={`rounded-xl shadow-sm border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Real-time Sessions</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Sessions created by admins appear instantly on student dashboards for immediate attendance marking.
            </p>
          </div>

          <div className={`rounded-xl shadow-sm border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Class Updates</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Teachers and class reps can post announcements with voice notes, text, or images.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`rounded-xl shadow-sm border p-8 text-center ${isDarkMode ? 'bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-blue-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'}`}>
          <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Ready to Try Smart Attendance?
          </h2>
          <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Experience the future of classroom attendance management with location-based verification and real-time updates.
          </p>
          <button
            onClick={handleTestAttendance}
            className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white py-4 px-8 rounded-lg font-semibold hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800 transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <span>Test It Out Now</span>
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;