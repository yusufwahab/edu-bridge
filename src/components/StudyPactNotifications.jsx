import React, { useState, useEffect } from 'react';
import { Bell, Users, Flame, AlertTriangle, X, Play } from 'lucide-react';

const StudyPactNotifications = ({ activePact, onStartStudy, onBreakPact }) => {
  const [notificationLevel, setNotificationLevel] = useState(0);
  const [timeUntilSession, setTimeUntilSession] = useState(null);
  const [showFullScreenAlert, setShowFullScreenAlert] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    if (!activePact) return;

    const checkTime = () => {
      const sessionTime = new Date(`${activePact.date}T${activePact.time}`);
      const now = new Date();
      const diffMs = sessionTime - now;
      const diffMins = Math.floor(diffMs / (1000 * 60));

      setTimeUntilSession(diffMins);

      // Notification levels
      if (diffMins <= 0 && diffMins > -5) {
        setNotificationLevel(4); // Session time - full takeover
        setShowFullScreenAlert(true);
      } else if (diffMins <= 5) {
        setNotificationLevel(3); // 5 mins before - modal
        setShowFullScreenAlert(true);
      } else if (diffMins <= 15) {
        setNotificationLevel(2); // 15 mins before - banner
      } else if (diffMins <= 30) {
        setNotificationLevel(1); // 30 mins before - gentle
      } else {
        setNotificationLevel(0);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [activePact]);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Enable audio for alerts
    setAudioEnabled(true);
  }, []);

  useEffect(() => {
    if (notificationLevel >= 2) {
      // Send browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        const title = notificationLevel === 4 ? 'Study Pact Starting NOW!' : 
                     notificationLevel === 3 ? 'Study Pact in 5 minutes!' : 
                     'Study Pact Reminder';
        
        new Notification(title, {
          body: `${activePact?.subject} study session with friends`,
          icon: '/favicon.ico',
          tag: 'study-pact'
        });
      }

      // Vibration for mobile
      if ('vibrate' in navigator) {
        const pattern = notificationLevel === 4 ? [200, 100, 200, 100, 200] : [200, 100, 200];
        navigator.vibrate(pattern);
      }

      // Audio alert
      if (audioEnabled && notificationLevel >= 3) {
        playAlertSound();
      }
    }
  }, [notificationLevel]);

  useEffect(() => {
    if (showFullScreenAlert && notificationLevel === 4) {
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Auto-break pact if no action taken
            handleBreakPact();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [showFullScreenAlert, notificationLevel]);

  const playAlertSound = () => {
    // Create audio context for alert sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleStartStudy = () => {
    setShowFullScreenAlert(false);
    setNotificationLevel(0);
    onStartStudy && onStartStudy();
  };

  const handleBreakPact = () => {
    setShowFullScreenAlert(false);
    setNotificationLevel(0);
    onBreakPact && onBreakPact();
  };

  const getParticipantStatus = () => {
    // Mock data for demo
    return [
      { name: 'Chidi', status: 'studying', joinedAt: '2 mins ago' },
      { name: 'Amaka', status: 'studying', joinedAt: '1 min ago' },
      { name: 'Kemi', status: 'waiting', joinedAt: null }
    ];
  };

  // Full-screen alert for levels 3 and 4
  if (showFullScreenAlert && (notificationLevel === 3 || notificationLevel === 4)) {
    const participants = getParticipantStatus();
    const studyingCount = participants.filter(p => p.status === 'studying').length;
    
    return (
      <div className="fixed inset-0 z-[999999] bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-16 h-16 bg-white rounded-full animate-pulse delay-500"></div>
        </div>

        <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          {/* Alert Icon */}
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
              <Bell className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {notificationLevel === 4 ? 'Study Pact Starting NOW!' : 'Study Pact Alert!'}
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            {activePact?.subject} • {activePact?.duration} minutes
          </p>

          {/* Countdown for level 4 */}
          {notificationLevel === 4 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="text-2xl font-bold text-red-600 mb-2">
                Auto-break in {countdown}s
              </div>
              <p className="text-sm text-red-700">
                Take action now or your pact will be automatically broken!
              </p>
            </div>
          )}

          {/* Participants Status */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Friends Status ({studyingCount} studying)
            </h3>
            <div className="space-y-2">
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      participant.status === 'studying' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-sm text-gray-700">{participant.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {participant.status === 'studying' ? `Joined ${participant.joinedAt}` : 'Waiting...'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Streak Warning */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-orange-700">7-Day Streak at Risk!</span>
            </div>
            <p className="text-sm text-orange-600">
              Breaking this pact will reset your streak and notify your friends.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleStartStudy}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Play className="w-6 h-6" />
              START STUDYING NOW
            </button>
            
            <button
              onClick={handleBreakPact}
              className="w-full py-2 text-red-600 hover:text-red-700 text-sm font-medium transition"
            >
              Break Pact (Lose Streak)
            </button>
          </div>

          {/* Cannot dismiss notice */}
          <div className="mt-4 text-xs text-gray-500">
            Can't dismiss • Friends will be notified of your choice
          </div>
        </div>
      </div>
    );
  }

  // Banner notification for level 2
  if (notificationLevel === 2) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 animate-bounce" />
            <div>
              <div className="font-bold">Study Pact in 15 minutes!</div>
              <div className="text-sm opacity-90">{activePact?.subject} with friends</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleStartStudy}
              className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Start Early
            </button>
            <button
              onClick={() => setNotificationLevel(0)}
              className="text-white hover:text-gray-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Gentle notification for level 1
  if (notificationLevel === 1) {
    return (
      <div className="fixed bottom-4 right-4 z-40 bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-700 via-blue-700 to-indigo-700 rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-800">Study Pact Reminder</div>
            <div className="text-sm text-gray-600">Starting in 30 minutes</div>
          </div>
        </div>
        <div className="text-sm text-gray-700 mb-3">
          {activePact?.subject} • {activePact?.duration}min
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleStartStudy}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition"
          >
            Prepare Now
          </button>
          <button
            onClick={() => setNotificationLevel(0)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default StudyPactNotifications;