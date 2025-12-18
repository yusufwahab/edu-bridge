import React, { useState, useEffect } from 'react';
import StudyPactCreation from './StudyPactCreation';
import StudyPactNotifications from './StudyPactNotifications';
import { useTheme } from '../contexts/ThemeContext';
import { pactsAPI, activityAPI } from '../utils/api';
import { Users, Plus, Calendar, Flame, UserPlus, Bell, Clock, AlertTriangle, CheckCircle, X, Mail, Send } from 'lucide-react';

const StudyPactsPage = () => {
  const { isDarkMode } = useTheme();
  const [currentView, setCurrentView] = useState('overview');
  const [pacts, setPacts] = useState([]);
  const [activePact, setActivePact] = useState(null);
  const [studyRequests, setStudyRequests] = useState([
    { id: 1, from: 'Chidi Okafor', subject: 'JAMB Mathematics', time: '6:00 PM', date: 'Today', status: 'pending' },
    { id: 2, from: 'Amaka Nwankwo', subject: 'WAEC Physics', time: '4:00 PM', date: 'Tomorrow', status: 'pending' }
  ]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState(null);
  const [showEmailInput, setShowEmailInput] = useState({});
  const [emailInputs, setEmailInputs] = useState({});
  const [sharingPact, setSharingPact] = useState(null);
  const [pactsStats, setPactsStats] = useState({
    streak: 0,
    totalPacts: 0,
    completedPacts: 0,
    studyPartners: 0
  });
  const [recentPacts, setRecentPacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPactsData = async () => {
      try {
        const [pactsData, analytics, history, streak] = await Promise.all([
          pactsAPI.getAll().catch(() => []),
          pactsAPI.getAnalytics().catch(() => ({ totalPacts: 0, completedPacts: 0, streaks: 0 })),
          pactsAPI.getHistory().catch(() => []),
          activityAPI.getStreak().catch(() => ({ streak: 0 }))
        ]);
        
        setPacts(pactsData);
        setRecentPacts(history.slice(0, 5)); // Show last 5 pacts
        
        // Set active pact if any
        const active = pactsData.find(pact => pact.status === 'active' || pact.status === 'scheduled');
        if (active) {
          setActivePact(active);
        }
        
        // Update stats
        setPactsStats({
          streak: streak.streak || 0,
          totalPacts: analytics.totalPacts || pactsData.length,
          completedPacts: analytics.completedPacts || 0,
          studyPartners: new Set(pactsData.flatMap(p => p.participants?.map(participant => 
            typeof participant === 'string' ? participant : participant.email
          ) || [])).size
        });
        
      } catch (error) {
        console.error('Error fetching pacts data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPactsData();
  }, []);

  const handleSharePact = async (pactId) => {
    const email = emailInputs[pactId];
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    setSharingPact(pactId);
    try {
      await pactsAPI.share(pactId, email);
      setNotificationData({ type: 'shared', email });
      setShowNotification(true);
      setEmailInputs(prev => ({ ...prev, [pactId]: '' }));
      setShowEmailInput(prev => ({ ...prev, [pactId]: false }));
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Error sharing pact:', error);
      alert('Failed to send invitation. Please try again.');
    } finally {
      setSharingPact(null);
    }
  };

  if (currentView === 'create') {
    return (
      <div className="p-6">
        <button
          onClick={() => setCurrentView('overview')}
          className="mb-4 text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          ← Back to Study Pacts
        </button>
        <StudyPactCreation
          onPactCreated={async (pact) => {
            try {
              // Transform pact data to match backend requirements
              const pactData = {
                title: pact.subject || `${pact.subject} Study Session`,
                subject: pact.subject,
                duration: parseInt(pact.duration),
                scheduledTime: pact.date && pact.time ? `${pact.date}T${pact.time}:00Z` : new Date(Date.now() + 3600000).toISOString(),
                description: 'Study session created via Classence',
                difficulty: 'Medium'
              };
              
              const newPact = await pactsAPI.create(pactData);
              setPacts([newPact, ...pacts]);
              setCurrentView('overview');
            } catch (error) {
              console.error('Error creating pact:', error);
              alert('Failed to create pact. Please try again.');
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Study Pacts</h1>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Study with friends for accountability</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentView('create')}
          className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Pact
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl p-6 shadow-lg`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{pactsStats.streak}</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Day Streak</div>
            </div>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl p-6 shadow-lg`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{pactsStats.totalPacts}</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Pacts</div>
            </div>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl p-6 shadow-lg`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{pactsStats.completedPacts}</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Completed</div>
            </div>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl p-6 shadow-lg`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{pactsStats.studyPartners}</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Study Partners</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Pacts */}
      <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6 mb-6`}>
        <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Active Pacts</h2>
        {activePact ? (
          <div className={`border rounded-lg p-4 ${isDarkMode ? 'border-green-600 bg-green-900/20' : 'border-green-200 bg-green-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>{activePact.title || activePact.subject}</h3>
              <span className={`px-2 py-1 rounded text-sm ${isDarkMode ? 'bg-green-800 text-green-200' : 'bg-green-200 text-green-800'}`}>
                {activePact.status === 'active' ? 'Active' : 'Scheduled'}
              </span>
            </div>
            <p className={`text-sm mb-2 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
              {activePact.scheduledTime ? new Date(activePact.scheduledTime).toLocaleString() : 'Time TBD'} • {activePact.duration} minutes
            </p>
            {activePact.participants && activePact.participants.length > 0 && (
              <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                With: {activePact.participants.slice(0, 3).map(p => 
                  typeof p === 'string' ? p.split('@')[0] : p.fullName || p.name || 'User'
                ).join(', ')}
                {activePact.participants.length > 3 && ` +${activePact.participants.length - 3} more`}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>No active pacts</p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Create your first study pact to get started!</p>
          </div>
        )}
      </div>

      {/* Recent Pacts */}
      <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
        <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Recent Pacts</h2>
        {recentPacts.length > 0 ? (
          <div className="space-y-3">
            {recentPacts.map((pact) => (
              <div key={pact.id} className={`p-3 rounded-lg ${isDarkMode ? 'border border-gray-600' : 'border border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{pact.title || pact.subject}</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {pact.completedAt ? new Date(pact.completedAt).toLocaleDateString() : 'Recently'}
                      {pact.participants && ` • With: ${pact.participants.slice(0, 2).map(p => 
                        typeof p === 'string' ? p.split('@')[0] : p.fullName || p.name || 'User'
                      ).join(', ')}`}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    pact.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {pact.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>No recent pacts</p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Complete study pacts to see your history here</p>
          </div>
        )}
      </div>

      {/* Study Requests */}
      {studyRequests.length > 0 && (
        <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6 mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold flex items-center ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>
              <UserPlus className="w-5 h-5 mr-2" />
              Study Requests
            </h2>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              {studyRequests.filter(r => r.status === 'pending').length} pending
            </span>
          </div>
          <div className="space-y-3">
            {studyRequests.map((request) => (
              <div key={request.id} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900">{request.from} invited you to study</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      {request.subject} • {request.date} at {request.time}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setStudyRequests(prev => prev.filter(r => r.id !== request.id));
                        setNotificationData({ type: 'accepted', from: request.from });
                        setShowNotification(true);
                        setTimeout(() => setShowNotification(false), 3000);
                      }}
                      className="px-3 py-1 bg-gradient-to-br from-gray-800 via-blue-800 to-indigo-800 text-white rounded text-sm hover:from-gray-700 hover:via-blue-700 hover:to-indigo-700 flex items-center space-x-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => {
                        setStudyRequests(prev => prev.filter(r => r.id !== request.id));
                      }}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 flex items-center space-x-1"
                    >
                      <X className="w-3 h-3" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Study Session Alert */}
      {activePact && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Study Pact Starting Soon!</h3>
                <p className="text-orange-100">
                  {activePact.subject} starts in 15 minutes • {activePact.friends.length + 1} participants
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setNotificationData({ type: 'started', subject: activePact.subject });
                  setShowNotification(true);
                  setTimeout(() => setShowNotification(false), 5000);
                }}
                className="px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Start Now
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to break this pact? This will notify all participants and reset your streak.')) {
                    setNotificationData({ type: 'broken', subject: activePact.subject });
                    setShowNotification(true);
                    setActivePact(null);
                    setTimeout(() => setShowNotification(false), 5000);
                  }
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Break Pact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pact Activity Feed */}
      <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6 mb-6`}>
        <h2 className={`text-xl font-bold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>
          <Flame className="w-5 h-5 mr-2 text-orange-500" />
          Live Activity
        </h2>
        <div className="text-center py-8">
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>No live activity</p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Join or create pacts to see live updates</p>
        </div>
      </div>

      {/* Notification Toast */}
      {showNotification && notificationData && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm">
          <div className="flex items-start space-x-3">
            {notificationData.type === 'accepted' && <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
            {notificationData.type === 'started' && <Clock className="w-5 h-5 text-blue-600 mt-0.5" />}
            {notificationData.type === 'broken' && <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />}
            <div className="flex-1">
              {notificationData.type === 'accepted' && (
                <p className="text-sm text-gray-800">
                  Study request accepted! {notificationData.from} has been notified.
                </p>
              )}
              {notificationData.type === 'started' && (
                <p className="text-sm text-gray-800">
                  {notificationData.subject} study session started! All participants notified.
                </p>
              )}
              {notificationData.type === 'broken' && (
                <p className="text-sm text-gray-800">
                  Pact broken. All participants have been notified. Your streak has been reset.
                </p>
              )}
              {notificationData.type === 'shared' && (
                <p className="text-sm text-gray-800">
                  Study pact invitation sent to {notificationData.email} successfully!
                </p>
              )}
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Notifications Component */}
      <StudyPactNotifications
        activePact={activePact}
        onStartStudy={() => console.log('Starting study session')}
        onBreakPact={() => console.log('Breaking pact')}
      />
    </div>
  );
};

export default StudyPactsPage;