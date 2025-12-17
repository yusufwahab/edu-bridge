import React, { useState, useEffect } from 'react';
import StudyPactCreation from './StudyPactCreation';
import StudyPactNotifications from './StudyPactNotifications';
import { Users, Plus, Calendar, Flame, UserPlus, Bell, Clock, AlertTriangle, CheckCircle, X } from 'lucide-react';

const StudyPactsPage = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [pacts, setPacts] = useState([]);
  const [activePact, setActivePact] = useState(null);
  const [studyRequests, setStudyRequests] = useState([
    { id: 1, from: 'Chidi Okafor', subject: 'JAMB Mathematics', time: '6:00 PM', date: 'Today', status: 'pending' },
    { id: 2, from: 'Amaka Nwankwo', subject: 'WAEC Physics', time: '4:00 PM', date: 'Tomorrow', status: 'pending' }
  ]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('studyPacts');
    if (stored) {
      setPacts(JSON.parse(stored));
    }

    // Mock active pact
    setActivePact({
      id: 1,
      subject: 'JAMB Mathematics',
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      duration: 45,
      friends: [
        { name: 'Chidi Okafor', status: 'confirmed' },
        { name: 'Amaka Nwankwo', status: 'confirmed' }
      ]
    });
  }, []);

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
          onPactCreated={(pact) => {
            setPacts([pact, ...pacts]);
            setCurrentView('overview');
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
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Study Pacts</h1>
            <p className="text-gray-600">Study with friends for accountability</p>
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
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">7</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{pacts.length}</div>
              <div className="text-sm text-gray-600">Total Pacts</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">15</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">5</div>
              <div className="text-sm text-gray-600">Study Partners</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Pacts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">Active Pacts</h2>
        {activePact ? (
          <div className="border border-green-200 bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-green-800">{activePact.subject}</h3>
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-sm">Active</span>
            </div>
            <p className="text-green-700 text-sm mb-2">
              Today at {activePact.time} • {activePact.duration} minutes
            </p>
            <p className="text-green-600 text-sm">
              With: {activePact.friends.map(f => f.name).join(', ')}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No active pacts. Create one to get started!</p>
        )}
      </div>

      {/* Recent Pacts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">Recent Pacts</h2>
        <div className="space-y-3">
          {[
            { subject: 'JAMB Physics', date: 'Yesterday', status: 'completed', participants: ['Chidi', 'Kemi'] },
            { subject: 'WAEC Chemistry', date: '2 days ago', status: 'completed', participants: ['Amaka', 'Tunde'] },
            { subject: 'JAMB English', date: '3 days ago', status: 'broken', participants: ['Chidi'] }
          ].map((pact, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800">{pact.subject}</h4>
                <p className="text-sm text-gray-600">{pact.date} • With: {pact.participants.join(', ')}</p>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${
                pact.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {pact.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Study Requests */}
      {studyRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent flex items-center">
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4 flex items-center">
          <Flame className="w-5 h-5 mr-2 text-orange-500" />
          Live Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Chidi completed JAMB Math pact - 15th streak! 🔥</span>
            <span className="text-xs text-green-600 ml-auto">2 mins ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">Tunde broke WAEC Chemistry pact 😞</span>
            <span className="text-xs text-red-600 ml-auto">5 mins ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800">Amaka started JAMB Physics pact (3/4 participants ready)</span>
            <span className="text-xs text-blue-600 ml-auto">8 mins ago</span>
          </div>
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