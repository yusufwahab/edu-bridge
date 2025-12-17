import React, { useEffect, useState } from 'react';
import { Calendar, BookOpen, Users, Trophy, TrendingUp, Clock, Target, Flame } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [userData, setUserData] = useState(null);
  const [nextPact, setNextPact] = useState(null);
  const [examCountdown, setExamCountdown] = useState(null);

  useEffect(() => {
    // Check if coming from onboarding
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('welcome') === 'true') {
      setShowWelcome(true);
    }

    // Load user data
    const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    setUserData(onboardingData);

    // Load next study pact
    const studyPacts = JSON.parse(localStorage.getItem('studyPacts') || '[]');
    const upcomingPact = studyPacts.find(pact => pact.status === 'scheduled');
    setNextPact(upcomingPact);

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
              <h2 className="text-xl sm:text-2xl font-bold mb-2">🎉 Welcome to YabvilPrep, {userData?.fullName?.split(' ')[0] || 'Student'}!</h2>
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
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
            Welcome back, {userData?.fullName?.split(' ')[0] || 'Student'}!
          </h1>
          <div className="flex items-center space-x-1 text-orange-500">
            <Flame className="w-6 h-6" />
            <span className="font-bold text-lg">7</span>
          </div>
        </div>
        <p className="text-gray-600">7-day study streak 🔥 Keep it going!</p>
      </div>

      {/* Next Study Pact Alert */}
      {nextPact && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-1">⏰ NEXT STUDY PACT</h3>
              <p className="text-blue-800 font-medium">
                {nextPact.subject} - Starts in {getTimeUntilPact(nextPact.scheduledTime)}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                {nextPact.participants?.slice(0, 2).map((participant, index) => (
                  <span key={index} className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm">
                    {participant.split('@')[0]}
                  </span>
                ))}
                <span className="text-blue-700 text-sm">are ready</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              <button className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white px-4 py-2 rounded-lg font-medium hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800">
                Start Early
              </button>
              <button 
                onClick={() => navigate('/study-pacts')}
                className="bg-white text-indigo-900 border border-indigo-300 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Countdown */}
      {examCountdown && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-1">🎯 EXAM COUNTDOWN</h3>
              <p className="text-red-800 font-medium">
                {userData?.examTarget || 'JAMB'} 2025 - {examCountdown} days remaining
              </p>
              <p className="text-red-700 text-sm mt-1">
                Readiness: {getReadinessScore()}% 
                <button 
                  onClick={() => navigate('/exam-predictions')}
                  className="text-red-600 hover:text-red-800 underline ml-2"
                >
                  View Predictions
                </button>
              </p>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
                <Target className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Study Streak</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">7 days</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Quizzes</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">24</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Study Pacts</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">15 completed</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Achievements</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">12</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">💬 Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/study-buddy')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="text-2xl mb-2">🤖</div>
                <div className="font-medium bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Ask Study Buddy</div>
                <div className="text-sm text-gray-600">Get AI-powered explanations</div>
              </button>
              
              <button 
                onClick={() => navigate('/cbt-practice')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="text-2xl mb-2">📝</div>
                <div className="font-medium bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Take Quiz</div>
                <div className="text-sm text-gray-600">Practice with past questions</div>
              </button>
              
              <button 
                onClick={() => navigate('/cbt-practice')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="text-2xl mb-2">📚</div>
                <div className="font-medium bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Browse Questions</div>
                <div className="text-sm text-gray-600">Explore question bank</div>
              </button>
              
              <button 
                onClick={() => navigate('/career-compass')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="text-2xl mb-2">🎓</div>
                <div className="font-medium bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Career Path</div>
                <div className="text-sm text-gray-600">Explore your future</div>
              </button>
            </div>
          </div>

          {/* Today's Focus */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">📊 TODAY'S FOCUS</h3>
            <p className="text-gray-700 mb-3">
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">Upcoming</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">JAMB Practice Test</p>
                  <p className="text-sm text-gray-600">Tomorrow, 2:00 PM</p>
                </div>
              </div>
              
              {nextPact && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Study Pact: {nextPact.subject}</p>
                    <p className="text-sm text-gray-600">In {getTimeUntilPact(nextPact.scheduledTime)}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Career Assessment</p>
                  <p className="text-sm text-gray-600">
                    {userData?.careerAssessment ? 'Completed ✅' : 'Pending completion'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">🏆 Recent Achievements</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-green-600">•</span>
                <span className="text-sm text-gray-700">Completed 15 Study Pacts</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">•</span>
                <span className="text-sm text-gray-700">Unlocked "Consistent Learner" badge</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-indigo-600">•</span>
                <span className="text-sm text-gray-700">40% improvement in {userData?.subjects?.[1] || 'Chemistry'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-green-600" />
                </div>
                <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Completed Physics Quiz - Waves</span>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Joined Study Pact with Chidi and Ada</span>
              </div>
              <span className="text-sm text-gray-500">5 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Earned "Consistent Learner" badge</span>
              </div>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;