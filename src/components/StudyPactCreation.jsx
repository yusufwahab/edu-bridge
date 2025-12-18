import React, { useState, useEffect } from 'react';
import { pactsAPI } from '../utils/api';
import { Calendar, Clock, Users, Flame, AlertTriangle, Plus, X, Check, Share2, MessageCircle, Mail, Send } from 'lucide-react';

const StudyPactCreation = ({ onPactCreated }) => {
  const [formData, setFormData] = useState({
    subject: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    duration: 30,
    friends: []
  });
  const [friendInput, setFriendInput] = useState('');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  const subjects = [
    'JAMB Mathematics', 'JAMB Physics', 'JAMB Chemistry', 'JAMB Biology',
    'JAMB English', 'WAEC Mathematics', 'WAEC Physics', 'WAEC Chemistry',
    'WAEC Biology', 'WAEC English', 'WAEC Economics', 'WAEC Government'
  ];

  const durations = [15, 30, 45, 60, 90, 120];

  useEffect(() => {
    const streak = localStorage.getItem('studyStreak') || 0;
    setCurrentStreak(parseInt(streak));
  }, []);

  const addFriend = () => {
    if (friendInput.trim() && formData.friends.length < 5) {
      setFormData({
        ...formData,
        friends: [...formData.friends, { name: friendInput.trim(), status: 'pending' }]
      });
      setFriendInput('');
    }
  };

  const removeFriend = (index) => {
    setFormData({
      ...formData,
      friends: formData.friends.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.time) return;
    
    const pact = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'active',
      participants: [
        { name: 'You', status: 'confirmed' },
        ...formData.friends
      ]
    };

    // Save to localStorage
    const existingPacts = JSON.parse(localStorage.getItem('studyPacts') || '[]');
    localStorage.setItem('studyPacts', JSON.stringify([pact, ...existingPacts]));
    
    onPactCreated && onPactCreated(pact);
  };

  const handleSendEmail = async () => {
    if (!emailInput.trim()) {
      alert('Please enter an email address');
      return;
    }

    setSendingEmail(true);
    try {
      // Create a temporary pact object for sharing
      const pactData = {
        subject: formData.subject || 'Study Session',
        date: formData.date,
        time: formData.time,
        duration: formData.duration
      };
      
      // Validate required fields
      if (!formData.subject || !formData.duration) {
        alert('Please select a subject and duration first');
        return;
      }

      // Create proper scheduledTime or use current time + 1 hour as default
      let scheduledTime;
      if (formData.date && formData.time) {
        scheduledTime = `${formData.date}T${formData.time}:00Z`;
      } else {
        const defaultTime = new Date();
        defaultTime.setHours(defaultTime.getHours() + 1);
        scheduledTime = defaultTime.toISOString();
      }

      // Create pact payload with required fields and defaults
      const pact = {
        title: `${formData.subject} Study Session`,
        subject: formData.subject,
        duration: parseInt(formData.duration),
        scheduledTime,
        description: 'Study session created via Classence',
        difficulty: 'Medium',
        inviteEmails: [emailInput]
      };
      
      console.log('Creating pact with payload:', pact);
      const response = await pactsAPI.create(pact);
      console.log('Pact creation response:', response);

      if (response) {
        alert(`Study pact created successfully! Invitation email sent to ${emailInput}. Please check your spam folder if not received within 5 minutes.`);
        setEmailInput('');
        setShowEmailInput(false);
      } else {
        throw new Error('Failed to create pact and send invitation');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send invitation. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  };

  const getTimeUntilSession = () => {
    if (!formData.date || !formData.time) return null;
    
    const sessionDateTime = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();
    const diffMs = sessionDateTime - now;
    
    if (diffMs <= 0) return 'Past time';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const days = Math.floor(diffHours / 24);
      return `${days} day${days > 1 ? 's' : ''} away`;
    }
    
    return `${diffHours}h ${diffMins}m away`;
  };

  if (showPreview) {
    const timeUntil = getTimeUntilSession();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Pact Preview</h1>
              <p className="text-gray-600">Review your study pact before confirming</p>
            </div>

            {/* Pact Details */}
            <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Subject</label>
                  <p className="text-lg font-semibold text-gray-800">{formData.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Duration</label>
                  <p className="text-lg font-semibold text-gray-800">{formData.duration} minutes</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date & Time</label>
                  <p className="text-lg font-semibold text-gray-800">
                    {new Date(`${formData.date}T${formData.time}`).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Starts In</label>
                  <p className="text-lg font-semibold text-indigo-600">{timeUntil}</p>
                </div>
              </div>

              {/* Participants */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Participants</label>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    You (Confirmed)
                  </div>
                  {formData.friends.map((friend, index) => (
                    <div key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                      {friend.name} (Pending)
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Streak Warning */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="font-semibold text-red-800">Streak at Risk!</h3>
              </div>
              <p className="text-red-700 text-sm mb-3">
                Breaking this pact will reset your {currentStreak}-day study streak.
              </p>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-orange-600">{currentStreak} Day Streak</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Edit Pact
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition shadow-lg"
              >
                Confirm Pact 🤝
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Study Pact</h1>
            <p className="text-gray-600">Commit to studying with friends for accountability</p>
          </div>

          {/* Current Streak Display */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-3">
              <Flame className="w-6 h-6 text-orange-500" />
              <span className="text-lg font-bold text-gray-800">
                Current Streak: {currentStreak} days
              </span>
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              Don't break your streak! Complete your pacts to keep it going.
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setShowPreview(true); }} className="space-y-6">
            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="">Choose a subject...</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Duration
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {durations.map(duration => (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => setFormData({ ...formData, duration })}
                    className={`p-3 rounded-lg border-2 transition ${
                      formData.duration === duration
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {duration}m
                  </button>
                ))}
              </div>
            </div>

            {/* Friends */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Invite Friends (Max 5)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Enter friend's name or phone"
                  value={friendInput}
                  onChange={(e) => setFriendInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFriend())}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={formData.friends.length >= 5}
                />
                <button
                  type="button"
                  onClick={addFriend}
                  disabled={!friendInput.trim() || formData.friends.length >= 5}
                  className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Share Options */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Study Pact
                </h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => window.open('https://chat.whatsapp.com/Eyv9xvEm81X7PG9FxL5Bz4', '_blank')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEmailInput(!showEmailInput)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Share your study pact details with friends to invite them
                </p>
                
                {showEmailInput && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Buddy's Email
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="email"
                        placeholder="friend@example.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={handleSendEmail}
                        disabled={sendingEmail || !emailInput.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1 text-sm"
                      >
                        {sendingEmail ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline">Share</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Friend List */}
              {formData.friends.length > 0 && (
                <div className="space-y-2">
                  {formData.friends.map((friend, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <span className="text-gray-700">{friend.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFriend(index)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!formData.subject || !formData.time}
              className="w-full py-4 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Preview Pact →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudyPactCreation;