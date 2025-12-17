import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { TrendingUp, Users, Trophy, Clock, MessageSquare, Heart, Share2 } from 'lucide-react';

const ActivityFeedPage = () => {
  const { isDarkMode } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');

  const activities = [
    {
      id: 1,
      type: 'achievement',
      user: 'You',
      action: 'unlocked a new badge!',
      badge: 'CONSISTENT LEARNER',
      description: 'Completed 7-day study streak!',
      time: 'Just now',
      celebrations: 15,
      comments: ['Congratulations!', 'Keep it up!']
    },
    {
      id: 2,
      type: 'study-pact',
      users: ['Chidi_Top_Math', 'Ada_Genius', 'Amaka_2025'],
      action: 'completed JAMB Math Study Pact',
      duration: '30 minutes',
      topic: 'Calculus',
      streak: '12-day streak maintained!',
      time: '2 mins ago',
      celebrations: 12,
      comments: 4
    },
    {
      id: 3,
      type: 'studying',
      user: 'Grace_JAMB',
      action: 'is studying Physics',
      topic: 'Wave Motion',
      status: 'Active now',
      message: 'Preparing for tomorrow\'s test. Anyone else studying Physics tonight?',
      time: '5 mins ago',
      responses: 3
    },
    {
      id: 4,
      type: 'progress',
      user: 'Blessing_SS3',
      action: 'improved 45% in Chemistry this week!',
      improvements: [
        { subject: 'Organic Chemistry', from: 62, to: 89 },
        { subject: 'Chemical Bonding', from: 55, to: 78 },
        { subject: 'Acids & Bases', from: 70, to: 82 }
      ],
      newStrength: 'Chemistry Pro',
      time: '15 mins ago',
      celebrations: 23
    }
  ];

  const filters = [
    { id: 'all', label: 'All', icon: TrendingUp },
    { id: 'friends', label: 'Friends Only', icon: Users },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'study-pacts', label: 'Study Pacts', icon: Clock }
  ];

  return (
    <div className="p-3 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Activity Feed</h1>
        <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>What's happening in the YabvilPrep community</p>
        <div className={`flex items-center space-x-4 mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span>89 posts today</span>
          <span>•</span>
          <span>234 active students</span>
        </div>
      </div>

      {/* Filters */}
      <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl shadow-lg p-4 mb-6`}>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white'
                    : isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl shadow-lg p-4 sm:p-6`}>
            {activity.type === 'achievement' && (
              <div>
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      <span className="font-bold">{activity.user}</span> {activity.action}
                    </p>
                    <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-lg font-bold text-yellow-900">🏅 "{activity.badge}"</div>
                      <div className="text-sm text-yellow-800">{activity.description}</div>
                    </div>
                    <div className={`flex items-center space-x-4 mt-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span>{activity.time}</span>
                      <button className="flex items-center space-x-1 text-red-500 hover:text-red-600">
                        <Heart className="w-4 h-4" />
                        <span>{activity.celebrations} celebrations</span>
                      </button>
                      <button className={`flex items-center space-x-1 ${isDarkMode ? 'hover:text-gray-200' : 'hover:text-gray-700'}`}>
                        <MessageSquare className="w-4 h-4" />
                        <span>Comment</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activity.type === 'study-pact' && (
              <div>
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      <span className="font-bold">{activity.users[0]}</span> {activity.action} with{' '}
                      <span className="font-bold">{activity.users.slice(1).join(' & ')}</span>
                    </p>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span>{activity.duration} focused study</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>📚 Topic: {activity.topic}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>🔥 {activity.streak}</span>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-4 mt-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span>{activity.time}</span>
                      <button className="flex items-center space-x-1 text-red-500 hover:text-red-600">
                        <Heart className="w-4 h-4" />
                        <span>{activity.celebrations} celebrations</span>
                      </button>
                      <button className={`flex items-center space-x-1 ${isDarkMode ? 'hover:text-gray-200' : 'hover:text-gray-700'}`}>
                        <MessageSquare className="w-4 h-4" />
                        <span>{activity.comments} comments</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activity.type === 'studying' && (
              <div>
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      <span className="font-bold">{activity.user}</span> {activity.action}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Topic: {activity.topic} • {activity.status}</p>
                    <div className={`mt-2 p-3 rounded-lg border ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                      <p className={`${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>"{activity.message}"</p>
                    </div>
                    <div className={`flex items-center space-x-4 mt-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span>{activity.time}</span>
                      <span>{activity.responses} students: "I'm studying too!"</span>
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Join Study Session
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activity.type === 'progress' && (
              <div>
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      <span className="font-bold">{activity.user}</span> {activity.action}
                    </p>
                    <div className="mt-2 space-y-2">
                      {activity.improvements.map((improvement, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{improvement.subject}:</span>
                          <span className="font-medium text-green-600">
                            {improvement.from}% → {improvement.to}% 📈
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className={`mt-2 p-2 rounded-lg ${isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}>
                      <span className={`font-medium ${isDarkMode ? 'text-indigo-200' : 'text-indigo-800'}`}>
                        🎯 New Strength Unlocked: "{activity.newStrength}"
                      </span>
                    </div>
                    <div className={`flex items-center space-x-4 mt-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span>{activity.time}</span>
                      <button className="flex items-center space-x-1 text-red-500 hover:text-red-600">
                        <Heart className="w-4 h-4" />
                        <span>{activity.celebrations} celebrations</span>
                      </button>
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Ask How They Did It
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white px-6 py-3 rounded-lg font-medium hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800">
          Load More Activity...
        </button>
      </div>
    </div>
  );
};

export default ActivityFeedPage;