import React, { useState, useEffect } from 'react';
import { Brain, MessageCircle, TrendingUp, Clock, Target, Lightbulb } from 'lucide-react';
import useStudyMemory from '../hooks/useStudyMemory';

const StudyBuddyDashboard = () => {
  const { memory, getPersonalizedGreeting, getProactiveSuggestions, getProgressCelebrations } = useStudyMemory();
  const [greeting, setGreeting] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [celebrations, setCelebrations] = useState([]);

  useEffect(() => {
    setGreeting(getPersonalizedGreeting());
    setSuggestions(getProactiveSuggestions());
    setCelebrations(getProgressCelebrations());
  }, [memory]);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Study Buddy AI</h1>
              <p className="text-gray-600">Your personalized learning companion</p>
            </div>
          </div>

          {/* Personalized Greeting */}
          <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 rounded-xl p-6">
            <p className="text-lg text-gray-700 leading-relaxed">{greeting}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Learning Journey */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Celebrations */}
            {celebrations.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Your Achievements
                </h2>
                <div className="space-y-3">
                  {celebrations.map((celebration, index) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 font-medium">{celebration.message}</p>
                      <span className="inline-block mt-2 text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                        {celebration.achievement}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Conversations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-indigo-600" />
                Recent Study Sessions
              </h2>
              
              {memory.conversations.length > 0 ? (
                <div className="space-y-4">
                  {memory.conversations.slice(0, 5).map((conversation) => (
                    <div key={conversation.id} className="border-l-4 border-indigo-200 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">{conversation.topic}</h3>
                        <span className="text-sm text-gray-500">
                          {formatTimeAgo(conversation.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{conversation.question}</p>
                      {conversation.performance !== null && (
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            conversation.performance >= 80 ? 'bg-green-500' : 
                            conversation.performance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <span className="text-xs text-gray-500">
                            Performance: {conversation.performance}%
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No study sessions yet. Start learning to build your journey!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Proactive Suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Suggestions
                </h2>
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className={`p-3 rounded-lg border-l-4 ${
                      suggestion.priority === 'high' ? 'border-red-400 bg-red-50' :
                      suggestion.priority === 'medium' ? 'border-yellow-400 bg-yellow-50' :
                      'border-blue-400 bg-blue-50'
                    }`}>
                      <p className="text-sm text-gray-700">{suggestion.message}</p>
                      {suggestion.topic && (
                        <button className="mt-2 text-xs bg-white px-2 py-1 rounded border hover:bg-gray-50">
                          Study {suggestion.topic}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Study Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Study Stats
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Sessions</span>
                  <span className="font-bold text-2xl text-indigo-600">
                    {memory.stats.totalSessions}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Topics Mastered</span>
                  <span className="font-bold text-2xl text-green-600">
                    {memory.masteredTopics.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Areas to Review</span>
                  <span className="font-bold text-2xl text-orange-600">
                    {memory.struggledTopics.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Struggled Topics */}
            {memory.struggledTopics.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Topics to Review
                </h2>
                <div className="space-y-2">
                  {memory.struggledTopics.slice(0, 5).map((topic, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                      <span className="text-sm text-gray-700">{topic.topic}</span>
                      <span className="text-xs text-orange-600">
                        {topic.attempts} attempts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mastered Topics */}
            {memory.masteredTopics.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Mastered Topics
                </h2>
                <div className="space-y-2">
                  {memory.masteredTopics.slice(0, 5).map((topic, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm text-gray-700">{topic.topic}</span>
                      <span className="text-xs text-green-600">
                        {topic.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyBuddyDashboard;