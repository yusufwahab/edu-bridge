import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Target, BookOpen, TrendingUp, Calendar, Clock, Download, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const LearningPage = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('predictions');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [examType, setExamType] = useState('JAMB');
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Language'];
  const examTypes = ['JAMB', 'WAEC', 'NECO', 'POST-UTME'];

  // Mock prediction data
  const mockPredictions = {
    Mathematics: [
      { topic: 'Calculus', probability: 85, readiness: 65, lastAppeared: '2022', status: 'high' },
      { topic: 'Trigonometry', probability: 82, readiness: 45, lastAppeared: '2021', status: 'high' },
      { topic: 'Quadratic Equations', probability: 78, readiness: 82, lastAppeared: '2023', status: 'medium' },
      { topic: 'Statistics', probability: 72, readiness: 70, lastAppeared: '2023', status: 'medium' },
      { topic: 'Geometry', probability: 68, readiness: 88, lastAppeared: '2024', status: 'medium' }
    ],
    Physics: [
      { topic: 'Wave Motion', probability: 88, readiness: 55, lastAppeared: '2021', status: 'high' },
      { topic: 'Electricity', probability: 85, readiness: 72, lastAppeared: '2022', status: 'high' },
      { topic: 'Mechanics', probability: 80, readiness: 68, lastAppeared: '2023', status: 'high' }
    ]
  };

  const progressData = [
    { subject: 'Mathematics', current: 78, target: 85, improvement: 12 },
    { subject: 'Physics', current: 65, target: 80, improvement: -3 },
    { subject: 'Chemistry', current: 82, target: 85, improvement: 8 },
    { subject: 'English', current: 70, target: 75, improvement: 0 }
  ];

  const weeklyProgress = [
    { day: 'Mon', score: 65 },
    { day: 'Tue', score: 68 },
    { day: 'Wed', score: 72 },
    { day: 'Thu', score: 70 },
    { day: 'Fri', score: 75 },
    { day: 'Sat', score: 78 },
    { day: 'Sun', score: 80 }
  ];

  const studyPlan = [
    { day: 'Monday', subject: 'Calculus', duration: '2 hours', priority: 'high', completed: false },
    { day: 'Tuesday', subject: 'Organic Chemistry', duration: '1.5 hours', priority: 'medium', completed: false },
    { day: 'Wednesday', subject: 'English Essay', duration: '1 hour', priority: 'low', completed: false },
    { day: 'Thursday', subject: 'Revision - Weak Topics', duration: '2 hours', priority: 'high', completed: false },
    { day: 'Friday', subject: 'Full Practice Test', duration: '3 hours', priority: 'high', completed: false }
  ];

  useEffect(() => {
    if (activeTab === 'predictions') {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setPredictions(mockPredictions[selectedSubject] || []);
        setIsLoading(false);
      }, 1000);
    }
  }, [activeTab, selectedSubject]);

  const generateQuiz = (difficulty, questionCount) => {
    // Simulate quiz generation
    alert(`Generating ${questionCount} ${difficulty} questions for ${selectedSubject}...`);
  };

  const renderPredictionsTab = () => (
    <div className="space-y-6">
      {/* Controls */}
      <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <select 
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            className={`border rounded-lg px-3 py-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
          >
            {examTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select 
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className={`border rounded-lg px-3 py-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          <button className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white px-4 py-2 rounded-lg hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>
        
        <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>📊 {examType} 2025 PREDICTIONS</h2>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Based on 15 years of historical data and AI analysis</p>
      </div>

      {/* Predictions */}
      {isLoading ? (
        <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-8 text-center`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Analyzing exam patterns...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* High Priority Topics */}
          <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
            <h3 className="text-lg font-semibold text-red-900 mb-4">🚨 HIGH PROBABILITY (85%+)</h3>
            {predictions.filter(p => p.status === 'high').map((topic, index) => (
              <div key={index} className="border border-red-200 rounded-lg p-4 mb-3 bg-red-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-red-900">{topic.topic}</h4>
                  <span className="text-sm font-bold text-red-700">{topic.probability}%</span>
                </div>
                <p className="text-sm text-red-700 mb-2">Last appeared: {topic.lastAppeared}</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-red-700">Your readiness:</span>
                    <div className="w-16 sm:w-24 bg-red-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${topic.readiness < 60 ? 'bg-red-600' : topic.readiness < 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${topic.readiness}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-red-700">{topic.readiness}%</span>
                    {topic.readiness < 60 && <span className="text-red-600">🚨</span>}
                    {topic.readiness >= 60 && topic.readiness < 80 && <span className="text-yellow-600">⚠️</span>}
                    {topic.readiness >= 80 && <span className="text-green-600">✅</span>}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button 
                      onClick={() => generateQuiz('hard', 10)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      {topic.readiness < 60 ? 'Priority Study' : 'Study Now'}
                    </button>
                    <button className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200">
                      Past Questions
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Medium Priority Topics */}
          <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
            <h3 className="text-lg font-semibold text-yellow-900 mb-4">⚠️ MEDIUM PROBABILITY (60-85%)</h3>
            {predictions.filter(p => p.status === 'medium').map((topic, index) => (
              <div key={index} className="border border-yellow-200 rounded-lg p-4 mb-3 bg-yellow-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-yellow-900">{topic.topic}</h4>
                  <span className="text-sm font-bold text-yellow-700">{topic.probability}%</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-yellow-700">Your readiness:</span>
                    <div className="w-16 sm:w-24 bg-yellow-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${topic.readiness < 60 ? 'bg-red-600' : topic.readiness < 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${topic.readiness}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-yellow-700">{topic.readiness}%</span>
                    {topic.readiness >= 80 && <span className="text-green-600">✅</span>}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button 
                      onClick={() => generateQuiz('medium', 15)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                    >
                      Practice
                    </button>
                    <button className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-sm hover:bg-yellow-200">
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Readiness Score */}
          <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>🎯 Your Overall Readiness</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="72, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>72%</span>
                </div>
              </div>
            </div>
            <p className={`text-center mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              You're well-prepared! Focus on high-priority topics to reach 85%
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderPracticeTab = () => (
    <div className="space-y-6">
      {/* Quiz Generator */}
      <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
        <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>📝 START A QUIZ</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Select Exam Type:</label>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              {examTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setExamType(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    examType === type
                      ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white'
                      : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Select Subject:</label>
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Number of Questions:</label>
          <div className="flex space-x-3">
            {[10, 20, 30, 50].map(count => (
              <button
                key={count}
                onClick={() => generateQuiz('mixed', count)}
                className={`px-4 py-2 rounded-lg font-medium ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Difficulty:</label>
          <div className="flex space-x-3">
            {['Easy', 'Medium', 'Hard', 'Mixed'].map(difficulty => (
              <button
                key={difficulty}
                onClick={() => generateQuiz(difficulty.toLowerCase(), 20)}
                className={`px-4 py-2 rounded-lg font-medium ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <button 
            onClick={() => generateQuiz('mixed', 20)}
            className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white px-6 py-3 rounded-lg font-medium hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800"
          >
            Generate Quiz
          </button>
          <button className="bg-gradient-to-br from-gray-800 via-blue-800 to-indigo-800 text-white px-6 py-3 rounded-lg font-medium hover:from-gray-700 hover:via-blue-700 hover:to-indigo-700">
            Practice Past Questions
          </button>
        </div>
      </div>

      {/* Question Trading */}
      <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>🔄 ExamSwap Question Trading</h3>
        <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Trade questions with other students and earn coins</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className={`border rounded-lg p-4 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>"Hard Calculus Pack" by @ChidiExcel</h4>
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex text-yellow-400">
                {'★'.repeat(5)}
              </div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>50 coins</span>
            </div>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
              Buy
            </button>
          </div>
          
          <div className={`border rounded-lg p-4 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>"WAEC Chemistry 2024 Style" by @AdaGenius</h4>
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex text-yellow-400">
                {'★'.repeat(4)}
              </div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>30 coins</span>
            </div>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
              Buy
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🪙</span>
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Your Question Coins: 120</span>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700">
            Create Question to Earn Coins
          </button>
        </div>
      </div>
    </div>
  );

  const renderProgressTab = () => (
    <div className="space-y-6">
      {/* Performance Analytics */}
      <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
        <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>📈 PERFORMANCE ANALYTICS</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Subject Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="current" fill="#3b82f6" />
                <Bar dataKey="target" fill="#e5e7eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Weekly Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Subject Performance</h3>
        <div className="space-y-4">
          {progressData.map((subject, index) => (
            <div key={index} className={`border rounded-lg p-4 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <div className="flex justify-between items-center mb-2">
                <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>{subject.subject}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>{subject.current}%</span>
                  <span className={`text-sm ${subject.improvement > 0 ? 'text-green-600' : subject.improvement < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {subject.improvement > 0 ? '+' : ''}{subject.improvement}% this week
                    {subject.improvement > 0 ? ' 📈' : subject.improvement < 0 ? ' 📉' : ''}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${subject.current}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
          <h3 className="text-lg font-semibold text-green-900 mb-4">✅ Strengths</h3>
          <div className="space-y-2">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <span className="text-green-800 font-medium">Algebra</span>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <span className="text-green-800 font-medium">Chemical Bonding</span>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <span className="text-green-800 font-medium">Essay Writing</span>
            </div>
          </div>
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
          <h3 className="text-lg font-semibold text-red-900 mb-4">⚠️ Needs Work</h3>
          <div className="space-y-2">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <span className="text-red-800 font-medium">Calculus</span>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <span className="text-red-800 font-medium">Wave Motion</span>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <span className="text-red-800 font-medium">Comprehension</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlansTab = () => (
    <div className="space-y-6">
      {/* Study Plan Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
        <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>🗓️ YOUR PERSONALIZED STUDY PLAN</h2>
        <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>JAMB 2025 - 47 days remaining</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">AI Recommendations:</h3>
          <p className="text-blue-800 text-sm">
            "Focus on Trigonometry this week - high exam probability but you're at 45%"
          </p>
        </div>
      </div>

      {/* This Week's Plan */}
      <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>This Week's Focus:</h3>
        <div className="space-y-3">
          {studyPlan.map((plan, index) => (
            <div key={index} className={`border rounded-lg p-4 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    checked={plan.completed}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>
                      {plan.day}: {plan.subject}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{plan.duration}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    plan.priority === 'high' ? 'bg-red-100 text-red-800' :
                    plan.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {plan.priority} priority
                  </span>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    Start
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
            View Full 47-Day Roadmap
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700">
            Adjust Plan
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700">
            Mark Complete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full">
      {/* Tab Navigation */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="flex space-x-4 sm:space-x-8 px-3 sm:px-6 overflow-x-auto">
          {[
            { id: 'predictions', label: 'Predictions', icon: '📊' },
            { id: 'practice', label: 'Practice', icon: '📝' },
            { id: 'progress', label: 'Progress', icon: '📈' },
            { id: 'plans', label: 'Plans', icon: '🗓️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : isDarkMode ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-3 sm:p-6">
        {activeTab === 'predictions' && renderPredictionsTab()}
        {activeTab === 'practice' && renderPracticeTab()}
        {activeTab === 'progress' && renderProgressTab()}
        {activeTab === 'plans' && renderPlansTab()}
      </div>
    </div>
  );
};

export default LearningPage;