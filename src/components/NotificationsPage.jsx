import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Bell, Trophy, Users, Calendar, BookOpen, CheckCircle, X } from 'lucide-react';

const NotificationsPage = () => {
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'achievement',
      title: 'Study Streak Achievement!',
      message: 'Congratulations! You\'ve maintained a 7-day study streak in Mathematics.',
      time: '2 minutes ago',
      read: false,
      icon: Trophy,
      color: 'text-yellow-500'
    },
    {
      id: 2,
      type: 'pact',
      title: 'Study Pact Reminder',
      message: 'Your Physics study session with Kemi starts in 30 minutes.',
      time: '15 minutes ago',
      read: false,
      icon: Users,
      color: 'text-blue-500'
    },
    {
      id: 3,
      type: 'exam',
      title: 'JAMB Practice Test Available',
      message: 'New Mathematics practice test is ready. Take it now to improve your score!',
      time: '1 hour ago',
      read: true,
      icon: BookOpen,
      color: 'text-green-500'
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Study Session Reminder',
      message: 'Don\'t forget your Chemistry study session scheduled for 4:00 PM today.',
      time: '2 hours ago',
      read: true,
      icon: Calendar,
      color: 'text-purple-500'
    },
    {
      id: 5,
      type: 'achievement',
      title: 'Weekly Goal Completed!',
      message: 'Amazing! You\'ve completed 15 hours of study this week.',
      time: '1 day ago',
      read: true,
      icon: Trophy,
      color: 'text-yellow-500'
    },
    {
      id: 6,
      type: 'pact',
      title: 'Study Pact Completed',
      message: 'Great job! You and Tunde successfully completed your English Literature session.',
      time: '2 days ago',
      read: true,
      icon: CheckCircle,
      color: 'text-green-500'
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDarkMode 
                ? 'text-white' 
                : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'
            }`}>Notifications</h1>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Stay updated with your study progress and reminders
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {unreadCount > 0 && (
          <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
            <Bell className="w-4 h-4" />
            <span>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No notifications</h3>
            <p className="text-gray-400">You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                  notification.read
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    notification.read ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-100 dark:bg-blue-800'
                  }`}>
                    <IconComponent className={`w-5 h-5 ${notification.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        } ${!notification.read ? 'font-bold' : ''}`}>
                          {notification.title}
                        </h3>
                        <p className={`mt-1 text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                          {notification.time}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;