import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onboardingAPI } from '../utils/api';
import { Clock, Users, Calendar, Sparkles, ArrowRight, Target, Zap, Trophy } from 'lucide-react';

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
  const [currentStep, setCurrentStep] = useState(0);

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Language', 'Literature', 'Government', 'Economics'];
  
  const suggestedTimes = [
    { time: '16:00', label: '4:00 PM', desc: 'After school focus time' },
    { time: '18:00', label: '6:00 PM', desc: 'Evening study session' },
    { time: '20:00', label: '8:00 PM', desc: 'Night deep work' },
    { time: '14:00', label: '2:00 PM', desc: 'Weekend afternoon' }
  ];

  const handleCreatePact = async () => {
    setIsCreating(true);

    try {
      const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
      
      // Save onboarding data to backend
      await onboardingAPI.complete(onboardingData);
      
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

      const existingPacts = JSON.parse(localStorage.getItem('studyPacts') || '[]');
      localStorage.setItem('studyPacts', JSON.stringify([...existingPacts, finalPactData]));

      localStorage.setItem('onboardingData', JSON.stringify({
        ...onboardingData,
        firstPact: finalPactData,
        onboardingCompleted: true,
        completedAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
    }

    setIsCreating(false);
    navigate('/dashboard?welcome=true');
  };

  const handleSkip = async () => {
    try {
      const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
      
      // Save onboarding data to backend
      await onboardingAPI.complete(onboardingData);
      
      localStorage.setItem('onboardingData', JSON.stringify({
        ...onboardingData,
        onboardingCompleted: true,
        completedAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
          <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse delay-700"></div>
        </div>

        <div className="flex items-center justify-center min-h-screen relative z-10">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center max-w-md border border-white/20">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto flex items-center justify-center animate-bounce">
                <Sparkles className="w-12 h-12 text-white animate-spin" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">Creating Your Study Pact...</h2>
            <p className="text-gray-300 mb-8 text-lg">AI is finding the perfect study time and setting up your accountability system</p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-white">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-xs">✓</span>
                </div>
                <span>Analyzing your schedule...</span>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse delay-300">
                  <span className="text-xs">✓</span>
                </div>
                <span>Setting up notifications...</span>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center animate-spin">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>Creating accountability system...</span>
              </div>
            </div>
            
            <div className="w-full bg-white/20 rounded-full h-3 mt-8">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full animate-pulse transition-all duration-1000" style={{width: '85%'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse delay-700"></div>
        <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-yellow-500/10 rounded-full blur-lg animate-pulse delay-300"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-white/20 rounded-full animate-ping delay-1000"></div>
        <div className="absolute top-3/4 left-1/4 w-1 h-1 bg-white/30 rounded-full animate-ping delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-white/10 rounded-full animate-ping delay-1500"></div>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-2xl border border-white/20">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-300">Step 4 of 4</span>
              <button onClick={handleSkip} className="text-sm text-gray-400 hover:text-white transition-colors">
                Skip for now
              </button>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full w-full shadow-lg"></div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mx-auto flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur-xl animate-pulse"></div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Create Your First Study Pact!</h1>
            <p className="text-gray-300 text-lg">Build accountability with friends and achieve your academic goals together</p>
          </div>

          <div className="space-y-8">
            {/* Subject Selection */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label className="block text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>What subject would you like to study?</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subjects.map(subject => (
                  <button
                    key={subject}
                    onClick={() => setPactData(prev => ({ ...prev, subject }))}
                    className={`p-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      pactData.subject === subject
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selection */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label className="block text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Study Duration</span>
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[30, 45, 60, 90].map(duration => (
                  <button
                    key={duration}
                    onClick={() => setPactData(prev => ({ ...prev, duration }))}
                    className={`p-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      pactData.duration === duration
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    <div className="text-xl font-bold">{duration}</div>
                    <div className="text-xs">minutes</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label className="block text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>When would you like to study?</span>
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {suggestedTimes.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      const dateStr = tomorrow.toISOString().split('T')[0];
                      setPactData(prev => ({ ...prev, scheduledTime: `${dateStr}T${suggestion.time}` }));
                    }}
                    className={`p-4 text-left border-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      pactData.scheduledTime.includes(suggestion.time)
                        ? 'border-green-500 bg-green-500/10 shadow-lg'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white">{suggestion.label}</div>
                        <div className="text-sm text-gray-300">{suggestion.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Or choose custom time:</label>
                <input
                  type="datetime-local"
                  value={pactData.scheduledTime}
                  onChange={(e) => setPactData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>

            {/* Friends Invitation */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="inviteFriends"
                  checked={pactData.inviteFriends}
                  onChange={(e) => setPactData(prev => ({ ...prev, inviteFriends: e.target.checked }))}
                  className="w-5 h-5 rounded border-white/20 text-blue-600 focus:ring-blue-500 mr-3"
                />
                <label htmlFor="inviteFriends" className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Invite friends to join this study pact</span>
                </label>
              </div>

              {pactData.inviteFriends && (
                <div className="space-y-3 mt-4">
                  {pactData.friendEmails.map((email, index) => (
                    <div key={index} className="flex space-x-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => updateFriendEmail(index, e.target.value)}
                        placeholder="friend@example.com"
                        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {pactData.friendEmails.length > 1 && (
                        <button
                          onClick={() => removeFriendEmail(index)}
                          className="px-4 py-3 text-red-400 hover:text-red-300 transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addFriendEmail}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    + Add another friend
                  </button>
                </div>
              )}
            </div>

            {/* AI Recommendation */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">AI Recommendation</h4>
                  <p className="text-blue-200 leading-relaxed">
                    Based on student success patterns, {suggestedTimes[0].desc.toLowerCase()} is optimal for focused study. 
                    Starting with 30-45 minutes helps build consistency and accountability!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 space-y-4">
            <button
              onClick={handleCreatePact}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-3"
            >
              <Users className="w-6 h-6" />
              <span>Create My First Study Pact</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            
            <button
              onClick={handleSkip}
              className="w-full text-gray-400 hover:text-white font-medium py-3 transition-colors"
            >
              I'll create a pact later
            </button>
          </div>

          {/* Motivation */}
          <div className="mt-8 text-center">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-sm text-gray-300 flex items-center justify-center space-x-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Study pacts increase focus by 73% and help you stay accountable!</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFirstPact;