import React, { useState, useEffect } from 'react';
import { Clock, Users, Eye, AlertTriangle, Trophy, Star, Share2, X } from 'lucide-react';

const StudyLockMode = ({ pact, onComplete, onBreak }) => {
  const [timeRemaining, setTimeRemaining] = useState(pact.duration * 60); // Convert to seconds
  const [distractions, setDistractions] = useState(0);
  const [focusTime, setFocusTime] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showBreakConfirmation, setShowBreakConfirmation] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [participants] = useState([
    { name: 'You', status: 'active', focusTime: 0 },
    { name: 'Chidi', status: 'active', focusTime: 0 },
    { name: 'Amaka', status: 'active', focusTime: 0 }
  ]);

  useEffect(() => {
    // Timer countdown
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSessionComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Track focus time
    const focusTimer = setInterval(() => {
      if (isVisible) {
        setFocusTime(prev => prev + 1);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(focusTimer);
    };
  }, [isVisible]);

  useEffect(() => {
    // Track page visibility for distraction detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
        setDistractions(prev => prev + 1);
      } else {
        setIsVisible(true);
      }
    };

    // Prevent navigation
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Are you sure? You\'ll break your pact and lose your streak!';
      return e.returnValue;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalSeconds = pact.duration * 60;
    return ((totalSeconds - timeRemaining) / totalSeconds) * 100;
  };

  const getFocusPercentage = () => {
    const totalElapsed = (pact.duration * 60) - timeRemaining;
    return totalElapsed > 0 ? Math.round((focusTime / totalElapsed) * 100) : 100;
  };

  const handleBreakAttempt = () => {
    if (showBreakConfirmation < 3) {
      setShowBreakConfirmation(prev => prev + 1);
    } else {
      handleBreakPact();
    }
  };

  const handleBreakPact = () => {
    // Reset streak
    localStorage.setItem('studyStreak', '0');
    
    // Update pact status
    const pacts = JSON.parse(localStorage.getItem('studyPacts') || '[]');
    const updatedPacts = pacts.map(p => 
      p.id === pact.id ? { ...p, status: 'broken', brokenAt: new Date().toISOString() } : p
    );
    localStorage.setItem('studyPacts', JSON.stringify(updatedPacts));
    
    onBreak && onBreak({
      pact,
      timeStudied: Math.floor(((pact.duration * 60) - timeRemaining) / 60),
      focusPercentage: getFocusPercentage(),
      distractions
    });
  };

  const handleSessionComplete = () => {
    // Update streak
    const currentStreak = parseInt(localStorage.getItem('studyStreak') || '0');
    localStorage.setItem('studyStreak', (currentStreak + 1).toString());
    
    // Update pact status
    const pacts = JSON.parse(localStorage.getItem('studyPacts') || '[]');
    const updatedPacts = pacts.map(p => 
      p.id === pact.id ? { ...p, status: 'completed', completedAt: new Date().toISOString() } : p
    );
    localStorage.setItem('studyPacts', JSON.stringify(updatedPacts));
    
    setShowCompletion(true);
  };

  const getBreakConfirmationMessage = () => {
    const messages = [
      'Are you sure you want to break your pact?',
      'This will reset your streak and notify friends. Continue?',
      'Final warning - there\'s no undo. Break pact?'
    ];
    return messages[showBreakConfirmation - 1] || messages[0];
  };

  // Completion Screen
  if (showCompletion) {
    const newStreak = parseInt(localStorage.getItem('studyStreak') || '0');
    const focusPercentage = getFocusPercentage();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          {/* Celebration Animation */}
          <div className="mb-6">
            <div className="text-8xl mb-4 animate-bounce">🎉</div>
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Pact Completed! 🏆
          </h1>
          
          <p className="text-gray-600 mb-6">
            You successfully studied {pact.subject} for {pact.duration} minutes!
          </p>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">{focusPercentage}%</div>
              <div className="text-sm text-green-700">Focus Time</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-orange-600">{newStreak}</div>
              <div className="text-sm text-orange-700">Day Streak</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-600">{pact.duration}</div>
              <div className="text-sm text-blue-700">Minutes</div>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-indigo-600">{distractions}</div>
              <div className="text-sm text-indigo-700">Distractions</div>
            </div>
          </div>

          {/* Achievements */}
          {newStreak % 7 === 0 && newStreak > 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-6 h-6 text-yellow-500" />
                <span className="font-bold text-yellow-700">New Achievement!</span>
              </div>
              <p className="text-sm text-yellow-600">
                {newStreak}-Day Study Streak Master! 🔥
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => {
                const text = `I just completed my study pact! 📚 Studied ${pact.subject} for ${pact.duration} minutes with ${focusPercentage}% focus. ${newStreak}-day streak! 🔥 #YabvilPrep`;
                if (navigator.share) {
                  navigator.share({ text });
                } else {
                  navigator.clipboard.writeText(text);
                  alert('Copied to clipboard!');
                }
              }}
              className="w-full py-3 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share Achievement
            </button>
            
            <button
              onClick={() => onComplete && onComplete({
                pact,
                focusPercentage,
                distractions,
                newStreak
              })}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{pact.subject}</h1>
            <p className="text-white/70">Study Lock Mode Active</p>
          </div>
          <button
            onClick={handleBreakAttempt}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg text-red-200 transition"
          >
            Exit Session
          </button>
        </div>
      </div>

      {/* Main Timer */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-64 h-64 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="white"
                  strokeOpacity="0.2"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${getProgress() * 2.827} 282.7`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-mono font-bold mb-2">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-white/70">remaining</div>
              </div>
            </div>
          </div>

          <div className="text-xl text-white/80 mb-8">
            Focus: {getFocusPercentage()}% • Distractions: {distractions}
          </div>
        </div>
      </div>

      {/* Participants Status */}
      <div className="p-6 border-t border-white/20">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Study Partners
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {participants.map((participant, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{participant.name}</span>
                  <div className={`w-3 h-3 rounded-full ${
                    participant.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                  }`}></div>
                </div>
                <div className="text-sm text-white/70">
                  {participant.status === 'active' ? 'Studying actively' : 'Away'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Break Confirmation Modal */}
      {showBreakConfirmation > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full text-gray-800">
            <div className="text-center mb-6">
              <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                {showBreakConfirmation === 3 ? 'Final Warning!' : 'Break Study Pact?'}
              </h2>
              <p className="text-gray-600">
                {getBreakConfirmationMessage()}
              </p>
            </div>

            {showBreakConfirmation === 3 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-red-800 mb-2">Consequences:</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Your 7-day streak will be reset to 0</li>
                  <li>• Friends will be notified you broke the pact</li>
                  <li>• You'll lose progress toward streak badges</li>
                  <li>• This action cannot be undone</li>
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowBreakConfirmation(0)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition"
              >
                Keep Studying
              </button>
              <button
                onClick={handleBreakAttempt}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
              >
                {showBreakConfirmation === 3 ? 'Break Pact' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyLockMode;