import React, { useEffect, useState } from 'react';
import { Calendar, BookOpen, Users, Trophy, TrendingUp, Clock, Target, Flame } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { dashboardAPI, activityAPI } from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const [showWelcome, setShowWelcome] = useState(false);
  const [userData, setUserData] = useState(null);
  const [nextPact, setNextPact] = useState(null);
  const [examCountdown, setExamCountdown] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    overview: {},
    quickStats: {},
    recentActivity: [],
    upcomingPacts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overview, quickStats, recentActivity, upcomingPacts, streak] = await Promise.all([
          dashboardAPI.getOverview().catch(() => ({})),
          dashboardAPI.getQuickStats().catch(() => ({})),
          dashboardAPI.getRecentActivity().catch(() => []),
          dashboardAPI.getUpcomingPacts().catch(() => []),
          activityAPI.getStreak().catch(() => ({ streak: 0 }))
        ]);
        
        // Use streak from activity API if quickStats doesn't have it
        if (!quickStats.currentStreak && streak.streak) {
          quickStats.currentStreak = streak.streak;
        }
        
        setDashboardData({ overview, quickStats, recentActivity, upcomingPacts });
        
        if (upcomingPacts.length > 0) {
          setNextPact(upcomingPacts[0]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Check if coming from onboarding
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('welcome') === 'true') {
      setShowWelcome(true);
    }

    // Load user data
    const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    setUserData(onboardingData);

    // Calculate exam countdown
    if (onboardingData.examDate) {
      const examDate = new Date(onboardingData.examDate);
      const today = new Date();
      const diffTime = examDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setExamCountdown(diffDays);
    } else if (onboardingData.examTarget === 'JAMB') {
      // Default JAMB 2025 date
      const jamb2025 = new Date('2025-05-15');
      const today = new Date();
      const diffTime = jamb2025 - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setExamCountdown(diffDays);
    }

    fetchDashboardData();
  }, [location]);

  const getTimeUntilPact = (pactTime) => {
    if (!pactTime) return null;
    const pactDate = new Date(pactTime);
    const now = new Date();
    const diff = pactDate - now;
    
    if (diff <= 0) return 'Starting now!';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getReadinessScore = () => {
    // Simulate readiness calculation based on user activity
    const baseScore = 65;
    const studyPacts = JSON.parse(localStorage.getItem('studyPacts') || '[]');
    const completedPacts = studyPacts.filter(pact => pact.status === 'completed').length;
    return Math.min(95, baseScore + (completedPacts * 3));
  };

  return (
    <div className="p-3 sm:p-6">
      {/* Welcome Message for New Users */}
      {showWelcome && (
        <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">🎉 Welcome to Classence, {userData?.fullName?.split(' ')[0] || 'Student'}!</h2>
              <p className="text-blue-100 mb-4">Your personalized learning journey starts now. Let's ace that {userData?.examTarget || 'exam'}!</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button 
                  onClick={() => navigate('/study-buddy')}
                  className="bg-white text-indigo-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-50"
                >
                  Meet Your Study Buddy 🤖
                </button>
                <button 
                  onClick={() => setShowWelcome(false)}
                  className="bg-blue-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                >
                  Explore Dashboard
                </button>
              </div>
            </div>
            <button 
              onClick={() => setShowWelcome(false)}
              className="text-blue-200 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>
            Welcome back, {userData?.fullName?.split(' ')[0] || 'Student'}!
          </h1>
          {dashboardData.quickStats.currentStreak > 0 && (
            <div className="flex items-center space-x-1 text-orange-500">
              <Flame className="w-6 h-6" />
              <span className="font-bold text-lg">{dashboardData.quickStats.currentStreak}</span>
            </div>
          )}
        </div>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{dashboardData.quickStats.currentStreak ? `${dashboardData.quickStats.currentStreak}-day study streak 🔥 Keep it going!` : 'Start your study streak today!'}</p>
      </div>

      {/* Next Study Pact Alert */}
      {nextPact && (
        <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-blue-50 border border-blue-200'} rounded-xl p-6 mb-8`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>⏰ NEXT STUDY PACT</h3>
              <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-blue-800'}`}>
                {nextPact.subject} - Starts in {getTimeUntilPact(nextPact.scheduledTime)}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                {nextPact.participants?.slice(0, 2).map((participant, index) => (
                  <span key={index} className={`px-2 py-1 rounded text-sm ${isDarkMode ? 'bg-white/20 text-gray-200' : 'bg-blue-200 text-blue-800'}`}>
                    {typeof participant === 'string' ? participant.split('@')[0] : participant.fullName || participant.name || 'User'}
                  </span>
                ))}
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-blue-700'}`}>are ready</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              <button className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white px-4 py-2 rounded-lg font-medium hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800">
                Start Early
              </button>
              <button 
                onClick={() => navigate('/study-pacts')}
                className={`px-4 py-2 rounded-lg font-medium ${isDarkMode ? 'bg-white/20 text-white border border-white/30 hover:bg-white/30' : 'bg-white text-indigo-900 border border-indigo-300 hover:bg-indigo-50'}`}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Countdown */}
      {examCountdown && (
        <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-red-50 border border-red-200'} rounded-xl p-6 mb-8`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-red-900'}`}>🎯 EXAM COUNTDOWN</h3>
              <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-red-800'}`}>
                {userData?.examTarget || 'JAMB'} 2025 - {examCountdown} days remaining
              </p>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-red-700'}`}>
                Readiness: {getReadinessScore()}% 
                <button 
                  onClick={() => navigate('/exam-predictions')}
                  className={`underline ml-2 ${isDarkMode ? 'text-gray-200 hover:text-white' : 'text-red-600 hover:text-red-800'}`}
                >
                  View Predictions
                </button>
              </p>
            </div>
            <div className="text-right">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${isDarkMode ? 'bg-white/20' : 'bg-red-100'}`}>
                <Target className={`w-8 h-8 ${isDarkMode ? 'text-white' : 'text-red-600'}`} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Study Streak</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>{dashboardData.quickStats.currentStreak || 0} days</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center hidden sm:flex">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Study Time</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>{dashboardData.quickStats.totalStudyTime || 0}h</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center hidden sm:flex">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Study Pacts</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>{dashboardData.quickStats.pactsCompleted || 0} completed</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center hidden sm:flex">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Average Score</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>{dashboardData.quickStats.averageScore || 0}%</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center hidden sm:flex">
              <Trophy className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>💬 Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/study-buddy')}
                className={`p-4 rounded-lg transition-colors text-left ${isDarkMode ? 'border border-gray-600 hover:bg-gray-700' : 'border border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="text-2xl mb-2">🤖</div>
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Ask Study Buddy</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Get AI-powered explanations</div>
              </button>
              
              <button 
                onClick={() => navigate('/cbt-practice')}
                className={`p-4 rounded-lg transition-colors text-left ${isDarkMode ? 'border border-gray-600 hover:bg-gray-700' : 'border border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="text-2xl mb-2">📝</div>
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Take Quiz</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Practice with past questions</div>
              </button>
              
              <button 
                onClick={() => navigate('/cbt-practice')}
                className={`p-4 rounded-lg transition-colors text-left ${isDarkMode ? 'border border-gray-600 hover:bg-gray-700' : 'border border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="text-2xl mb-2">📚</div>
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Browse Questions</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Explore question bank</div>
              </button>
              
              <button 
                onClick={() => navigate('/career-compass')}
                className={`p-4 rounded-lg transition-colors text-left ${isDarkMode ? 'border border-gray-600 hover:bg-gray-700' : 'border border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="text-2xl mb-2">🎓</div>
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Career Path</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Explore your future</div>
              </button>
            </div>
          </div>

          {/* Today's Focus */}
          <div className={`${isDarkMode ? 'bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20' : 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200'} rounded-xl p-6 mt-6`}>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>📊 TODAY'S FOCUS</h3>
            <p className={`mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              AI Recommendation: Study {userData?.subjects?.[0] || 'Mathematics'} (High priority)
            </p>
            <button 
              onClick={() => navigate('/study-buddy')}
              className="bg-gradient-to-br from-gray-800 via-blue-800 to-indigo-800 text-white px-4 py-2 rounded-lg font-medium hover:from-gray-700 hover:via-blue-700 hover:to-indigo-700"
            >
              Start Now
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Upcoming</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>JAMB Practice Test</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Tomorrow, 2:00 PM</p>
                </div>
              </div>
              
              {nextPact && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Study Pact: {nextPact.subject}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>In {getTimeUntilPact(nextPact.scheduledTime)}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Career Assessment</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {userData?.careerAssessment ? 'Completed ✅' : 'Pending completion'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>🏆 Recent Achievements</h2>
            <div className="text-center py-4">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Start a study session to unlock your first achievement!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6">
        <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
          <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Recent Activity</h2>
          <div className="text-center py-8">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
              No recent activity yet
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Complete quizzes and study pacts to see your activity here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;