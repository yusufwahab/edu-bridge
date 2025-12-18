import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MessageSquare, ThumbsUp, ThumbsDown, Award, Users, CheckCircle, AlertCircle, Send, Camera } from 'lucide-react';

const PeerTeachPage = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('explanations');
  const [newExplanation, setNewExplanation] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const topics = [
    'JAMB Mathematics - Quadratic Equations',
    'WAEC Physics - Motion',
    'JAMB Chemistry - Organic Chemistry',
    'WAEC Biology - Photosynthesis',
    'JAMB English - Comprehension'
  ];

  const staticExplanations = [
    {
      id: 1,
      topic: 'JAMB Mathematics - Quadratic Equations',
      student: 'Chidi Okafor',
      content: 'To solve quadratic equations using the formula method: x = (-b ± √(b²-4ac)) / 2a. Remember BODMAS when substituting values.',
      upvotes: 23,
      downvotes: 2,
      aiValidated: true,
      teacherPoints: 15,
      time: '2 hours ago',
      comments: 8
    },
    {
      id: 2,
      topic: 'WAEC Physics - Motion',
      student: 'Amaka Nwankwo',
      content: 'For uniformly accelerated motion, use v = u + at. Where v=final velocity, u=initial velocity, a=acceleration, t=time.',
      upvotes: 18,
      downvotes: 1,
      aiValidated: true,
      teacherPoints: 12,
      time: '4 hours ago',
      comments: 5
    },
    {
      id: 3,
      topic: 'JAMB Chemistry - Organic Chemistry',
      student: 'Tunde Adebayo',
      content: 'Alkanes follow the general formula CnH2n+2. Methane (CH4), Ethane (C2H6), Propane (C3H8)...',
      upvotes: 15,
      downvotes: 0,
      aiValidated: false,
      teacherPoints: 10,
      time: '6 hours ago',
      comments: 3
    }
  ];

  const [explanations, setExplanations] = useState(staticExplanations);

  const studyGroups = [
    {
      id: 1,
      name: 'JAMB Math Warriors',
      topic: 'Mathematics',
      members: 12,
      active: 8,
      description: 'Focused on JAMB Mathematics preparation',
      whatsappLink: 'https://chat.whatsapp.com/...'
    },
    {
      id: 2,
      name: 'Physics Explorers',
      topic: 'Physics',
      members: 15,
      active: 11,
      description: 'WAEC & JAMB Physics concepts',
      whatsappLink: 'https://chat.whatsapp.com/...'
    }
  ];

  const submitExplanation = async () => {
    if (!newExplanation.trim() || !selectedTopic) return;
    
    setIsLoading(true);
    try {
      // AI validation of explanation
      const validationResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are an AI tutor validator. Evaluate this student explanation for accuracy, clarity, and completeness. Topic: ${selectedTopic}. Provide a score (1-10) and brief feedback. Format: SCORE: X/10\nFEEDBACK: [your feedback]\nVALID: true/false`
            },
            { role: 'user', content: newExplanation }
          ],
          temperature: 0.3,
          max_tokens: 200
        })
      });

      const data = await validationResponse.json();
      const aiValidation = data.choices[0].message.content;
      
      // Extract score and validation
      const scoreMatch = aiValidation.match(/SCORE: (\d+)/i);
      const validMatch = aiValidation.match(/VALID: (true|false)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 5;
      const isValid = validMatch ? validMatch[1] === 'true' : score >= 7;
      
      // Calculate teacher points based on AI score
      const teacherPoints = Math.max(5, Math.floor(score * 1.5));
      
      const newExplanationObj = {
        id: Date.now(),
        topic: selectedTopic,
        student: 'You',
        content: newExplanation,
        upvotes: 0,
        downvotes: 0,
        aiValidated: isValid,
        teacherPoints,
        time: 'Just now',
        comments: 0,
        aiScore: score,
        aiFeedback: aiValidation.split('FEEDBACK:')[1]?.split('VALID:')[0]?.trim()
      };
      
      // Add to explanations list (in real app, this would be API call)
      setExplanations(prev => [newExplanationObj, ...prev]);
      
      setNewExplanation('');
      setSelectedTopic('');
      alert(`Explanation ${isValid ? 'approved' : 'needs improvement'}! AI Score: ${score}/10. You earned ${teacherPoints} teacher points.`);
      
    } catch (error) {
      console.error('AI validation error:', error);
      alert('Error validating explanation. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="p-3 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Peer Teach Network</h1>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Share knowledge, earn teacher points</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1,250</div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Teacher Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">4.8</div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex space-x-1 rounded-lg p-1 mb-6 sm:mb-8 overflow-x-auto ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        {[
          { id: 'explanations', label: 'Explanations', icon: MessageSquare },
          { id: 'groups', label: 'Study Groups', icon: Users },
          { id: 'contribute', label: 'Contribute', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition ${
                activeTab === tab.id
                  ? isDarkMode ? 'bg-gray-800 text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm'
                  : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Explanations Tab */}
      {activeTab === 'explanations' && (
        <div className="space-y-6">
          {explanations.map((explanation) => (
            <div key={explanation.id} className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl shadow-lg p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {explanation.student.split(' ')[0][0]}
                    </span>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{explanation.student}</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{explanation.topic}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{explanation.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {explanation.aiValidated && (
                    <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      <CheckCircle className="w-3 h-3" />
                      <span>AI Verified</span>
                    </div>
                  )}
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    +{explanation.teacherPoints} pts
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className={`leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{explanation.content}</p>
              </div>

              <div className={`flex items-center justify-between pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-green-600 hover:text-green-700">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm font-medium">{explanation.upvotes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-red-600 hover:text-red-700">
                    <ThumbsDown className="w-4 h-4" />
                    <span className="text-sm font-medium">{explanation.downvotes}</span>
                  </button>
                  <button className={`flex items-center space-x-1 hover:text-gray-700 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">{explanation.comments} comments</span>
                  </button>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Study Groups Tab */}
      {activeTab === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studyGroups.map((group) => (
            <div key={group.id} className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl shadow-lg p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{group.name}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{group.description}</p>
                </div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  {group.active} active
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{group.members} members</span>
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Topic: {group.topic}</div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => window.open('https://chat.whatsapp.com/Eyv9xvEm81X7PG9FxL5Bz4', '_blank')}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                  Join Group
                </button>
                <button
                  onClick={() => window.open('https://chat.whatsapp.com/Eyv9xvEm81X7PG9FxL5Bz4', '_blank')}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                >
                  WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contribute Tab */}
      {activeTab === 'contribute' && (
        <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl shadow-lg p-6`}>
          <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Share Your Knowledge</h2>
          
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Select Topic
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
              >
                <option value="">Choose a topic...</option>
                {topics.map((topic, index) => (
                  <option key={index} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Your Explanation
              </label>
              <textarea
                value={newExplanation}
                onChange={(e) => setNewExplanation(e.target.value)}
                placeholder="Share your knowledge... Be clear and detailed. AI will validate your explanation."
                className={`w-full h-32 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'}`}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex space-x-3">
                <button className={`flex items-center space-x-2 px-4 py-2 border rounded-lg ${isDarkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-50'}`}>
                  <Camera className="w-4 h-4" />
                  <span>Add Image</span>
                </button>
              </div>
              <button
                onClick={submitExplanation}
                disabled={!newExplanation.trim() || !selectedTopic || isLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>{isLoading ? 'AI Validating...' : 'Submit for Review'}</span>
              </button>
            </div>

            <div className={`${isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'} rounded-lg p-4`}>
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>AI Validation Process</h4>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                    Your explanation will be reviewed by AI for accuracy and clarity. 
                    High-quality explanations earn more teacher points and get featured.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeerTeachPage;