import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OnboardingFirstPact = () => {
  const navigate = useNavigate();
  const [pactData, setPactData] = useState({
    subject: '',
    duration: 30,
    scheduledTime: '',
    inviteFriends: false,
    friendEmails: ['']
  });
  const [isCreating, setIsCreating] = useState(false);

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Language', 'Literature', 'Government', 'Economics'];
  
  const suggestedTimes = [
    { time: '16:00', label: '4:00 PM - After school' },
    { time: '18:00', label: '6:00 PM - Evening study' },
    { time: '20:00', label: '8:00 PM - Night session' },
    { time: '14:00', label: '2:00 PM - Weekend afternoon' }
  ];

  const handleCreatePact = async () => {
    setIsCreating(true);

    // Simulate AI suggestion for optimal study time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get suggested time based on typical student patterns
    const now = new Date();
    const suggestedTime = now.getHours() < 16 ? '16:00' : '20:00';
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const suggestedDate = tomorrow.toISOString().split('T')[0];

    const finalPactData = {
      ...pactData,
      scheduledTime: pactData.scheduledTime || `${suggestedDate}T${suggestedTime}`,
      subject: pactData.subject || 'Mathematics',
      createdAt: new Date().toISOString(),
      status: 'scheduled',
      participants: pactData.inviteFriends ? pactData.friendEmails.filter(email => email) : []
    };

    // Save to localStorage
    const existingPacts = JSON.parse(localStorage.getItem('studyPacts') || '[]');
    localStorage.setItem('studyPacts', JSON.stringify([...existingPacts, finalPactData]));

    // Complete onboarding
    const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    localStorage.setItem('onboardingData', JSON.stringify({
      ...onboardingData,
      firstPact: finalPactData,
      onboardingCompleted: true,
      completedAt: new Date().toISOString()
    }));

    setIsCreating(false);
    navigate('/dashboard?welcome=true');
  };

  const handleSkip = () => {
    const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    localStorage.setItem('onboardingData', JSON.stringify({
      ...onboardingData,
      onboardingCompleted: true,
      completedAt: new Date().toISOString()
    }));
    navigate('/dashboard');
  };

  const addFriendEmail = () => {
    setPactData(prev => ({
      ...prev,
      friendEmails: [...prev.friendEmails, '']
    }));
  };

  const updateFriendEmail = (index, email) => {
    setPactData(prev => ({
      ...prev,
      friendEmails: prev.friendEmails.map((e, i) => i === index ? email : e)
    }));
  };

  const removeFriendEmail = (index) => {
    setPactData(prev => ({
      ...prev,
      friendEmails: prev.friendEmails.filter((_, i) => i !== index)
    }));
  };

  if (isCreating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="animate-pulse text-6xl mb-4">🤝</div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">Creating Your First Study Pact...</h2>
          <p className="text-gray-600 mb-4">AI is finding the perfect study time for you</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-600 h-2 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step 4 of 4</span>
            <button onClick={handleSkip} className="text-sm text-gray-500 hover:text-gray-700">
              Skip for now
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-600 h-2 rounded-full w-full"></div>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🤝</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">Set Your First Study Pact!</h1>
          <p className="text-gray-600">Let's schedule your first focused study session</p>
        </div>

        <div className="space-y-6">
          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What subject would you like to study?
            </label>
            <select
              value={pactData.subject}
              onChange={(e) => setPactData(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Select a subject</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Study Duration
            </label>
            <div className="flex space-x-3">
              {[30, 45, 60, 90].map(duration => (
                <button
                  key={duration}
                  onClick={() => setPactData(prev => ({ ...prev, duration }))}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    pactData.duration === duration
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {duration} min
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Times */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              When would you like to study? (AI Suggestions)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedTimes.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const dateStr = tomorrow.toISOString().split('T')[0];
                    setPactData(prev => ({ ...prev, scheduledTime: `${dateStr}T${suggestion.time}` }));
                  }}
                  className={`p-3 text-left border-2 rounded-lg transition-colors ${
                    pactData.scheduledTime.includes(suggestion.time)
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{suggestion.time}</div>
                  <div className="text-sm text-gray-600">{suggestion.label}</div>
                </button>
              ))}
            </div>
            
            {/* Custom Time */}
            <div className="mt-3">
              <label className="block text-sm text-gray-600 mb-1">Or choose custom time:</label>
              <input
                type="datetime-local"
                value={pactData.scheduledTime}
                onChange={(e) => setPactData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>

          {/* Invite Friends */}
          <div>
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="inviteFriends"
                checked={pactData.inviteFriends}
                onChange={(e) => setPactData(prev => ({ ...prev, inviteFriends: e.target.checked }))}
                className="mr-2 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="inviteFriends" className="text-sm font-medium text-gray-700">
                Invite friends to join this study pact
              </label>
            </div>

            {pactData.inviteFriends && (
              <div className="space-y-2">
                {pactData.friendEmails.map((email, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => updateFriendEmail(index, e.target.value)}
                      placeholder="friend@example.com"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                    {pactData.friendEmails.length > 1 && (
                      <button
                        onClick={() => removeFriendEmail(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-700"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addFriendEmail}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  + Add another friend
                </button>
              </div>
            )}
          </div>

          {/* AI Recommendation */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-start">
              <div className="text-2xl mr-3">🤖</div>
              <div>
                <h4 className="font-semibold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-1">AI Recommendation:</h4>
                <p className="text-sm text-gray-700">
                  Based on typical student patterns, {suggestedTimes[0].label.toLowerCase()} is optimal for focused study. 
                  Starting with 30-45 minutes helps build consistency!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <button
            onClick={handleCreatePact}
            className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Create My First Study Pact 🚀
          </button>
          
          <button
            onClick={handleSkip}
            className="w-full text-gray-500 hover:text-gray-700 font-medium"
          >
            I'll create a pact later
          </button>
        </div>

        {/* Motivation */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            🎯 Study pacts increase focus by 73% and help you stay accountable!
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFirstPact;