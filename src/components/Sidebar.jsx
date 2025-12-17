import React from 'react';
import { Home, Brain, Users, BarChart3, MapPin, BookOpen, Settings, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: Home, path: '/dashboard' },
    { id: 'study-buddy', label: 'Study Buddy', icon: Brain, path: '/study-buddy' },
    { id: 'learning', label: 'My Learning', icon: BookOpen, path: '/learning' },
    { id: 'study-pacts', label: 'Study Pacts', icon: Users, path: '/study-pacts' },
    { id: 'collaborative-learning', label: 'Collaborative', icon: Users, path: '/collaborative-learning' },
    { id: 'career-compass', label: 'Career', icon: MapPin, path: '/career-compass' },
    { id: 'cbt-practice', label: 'CBT Practice', icon: BarChart3, path: '/cbt-practice' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose && onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:z-auto`}>
        
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">YabvilPrep</h1>
              <p className="text-xs text-gray-500">Quality Education</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <p className="font-medium text-gray-800">Amaka Okafor</p>
              <p className="text-xs text-gray-500">SS3 Student</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;