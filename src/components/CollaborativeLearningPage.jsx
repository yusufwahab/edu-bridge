import React, { useState } from 'react';
import { Users, MessageSquare, Star, TrendingUp, BookOpen, Calendar, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CollaborativeLearningPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const features = [
    {
      id: 'peer-teach',
      title: 'Peer Teach',
      description: 'AI-moderated student collaboration network',
      icon: Users,
      color: 'blue',
      stats: { active: 234, points: 1250 }
    },
    {
      id: 'activity-feed',
      title: 'Study Activity Feed',
      description: 'Real-time social learning updates',
      icon: TrendingUp,
      color: 'green',
      stats: { posts: 89, likes: 456 }
    },
    {
      id: 'marketplace',
      title: 'Study Marketplace',
      description: 'Collaborative learning economy',
      icon: Star,
      color: 'indigo',
      stats: { tutors: 45, sessions: 123 }
    },
    {
      id: 'study-recipes',
      title: 'Study Recipes',
      description: 'Custom AI-generated study plans',
      icon: BookOpen,
      color: 'orange',
      stats: { recipes: 12, completed: 8 }
    }
  ];

  const recentActivity = [
    { user: 'Chidi O.', action: 'explained JAMB Math quadratic equations', points: '+15 pts', time: '2 mins ago' },
    { user: 'Amaka N.', action: 'completed 30-day WAEC prep recipe', badge: '🏆', time: '5 mins ago' },
    { user: 'Tunde A.', action: 'earned "Physics Master" badge', badge: '⚛️', time: '10 mins ago' },
    { user: 'Kemi S.', action: 'started tutoring Chemistry sessions', points: '+25 pts', time: '15 mins ago' }
  ];

  const topTeachers = [
    { name: 'Chidi Okafor', subject: 'Mathematics', points: 2450, rating: 4.9, sessions: 89 },
    { name: 'Amaka Nwankwo', subject: 'Physics', points: 2100, rating: 4.8, sessions: 67 },
    { name: 'Tunde Adebayo', subject: 'Chemistry', points: 1890, rating: 4.7, sessions: 54 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Collaborative Learning</h1>
              <p className="text-gray-600 mt-1">Learn together, grow together</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1,250</div>
                <div className="text-xs text-gray-600">Teacher Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">15</div>
                <div className="text-xs text-gray-600">Rank</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(feature.id === 'peer-teach' ? '/peer-teach' : feature.id === 'activity-feed' ? '/activity-feed' : feature.id === 'marketplace' ? '/study-marketplace' : '/study-recipes')}
              >
                <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {Object.entries(feature.stats)[0][1]} {Object.entries(feature.stats)[0][0]}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Recent Activity</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {activity.user.split(' ')[0][0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 text-sm">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {activity.points && (
                          <span className="text-green-600 text-xs font-medium">{activity.points}</span>
                        )}
                        {activity.badge && (
                          <span className="text-lg">{activity.badge}</span>
                        )}
                        <span className="text-gray-500 text-xs">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Teachers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Top Teachers</h2>
              <Award className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="space-y-4">
              {topTeachers.map((teacher, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{teacher.name}</p>
                    <p className="text-gray-600 text-xs">{teacher.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-600 font-semibold text-sm">{teacher.points}</p>
                    <p className="text-gray-500 text-xs">⭐ {teacher.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 sm:mt-8 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-xl p-4 sm:p-6 text-white">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Ready to Start Learning Together?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-center transition">
              <MessageSquare className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Ask Question</span>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-center transition">
              <Users className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Find Study Group</span>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-center transition">
              <Star className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Become Tutor</span>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-center transition">
              <Calendar className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Create Recipe</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeLearningPage;