import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FileText, Download, MessageCircle, Eye } from 'lucide-react';

const HistoryPage = ({ onBack }) => {
  const { isDarkMode } = useTheme();
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedTime, setSelectedTime] = useState('All Time');
  
  const conversations = [
    {
      id: 1,
      title: "Photosynthesis Discussion",
      subject: "Biology",
      date: "Today, 2:30 PM",
      messages: 15,
      savedExplanations: 3,
      duration: "25 min"
    },
    {
      id: 2,
      title: "Quadratic Equations Practice",
      subject: "Mathematics",
      date: "Yesterday, 4:15 PM",
      messages: 23,
      savedExplanations: 5,
      duration: "40 min"
    },
    {
      id: 3,
      title: "Chemical Bonding Concepts",
      subject: "Chemistry",
      date: "2 days ago, 1:20 PM",
      messages: 18,
      savedExplanations: 4,
      duration: "30 min"
    }
  ];

  const subjects = ['All Subjects', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];
  const timeFilters = ['All Time', 'Today', 'This Week', 'This Month'];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`shadow-sm border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBack}
              className={`flex items-center font-medium ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ← Back to Features
            </button>
            <h1 className={`text-2xl font-bold ${
              isDarkMode 
                ? 'text-white' 
                : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'
            }`}>Study History</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-xl shadow-sm border p-6 text-center ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <div className="text-3xl font-bold text-blue-600 mb-2">47</div>
            <div className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Total Sessions</div>
          </div>
          <div className={`rounded-xl shadow-sm border p-6 text-center ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <div className="text-3xl font-bold text-green-600 mb-2">18h</div>
            <div className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Study Time</div>
          </div>
          <div className={`rounded-xl shadow-sm border p-6 text-center ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <div className="text-3xl font-bold text-indigo-600 mb-2">156</div>
            <div className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Questions Asked</div>
          </div>
          <div className={`rounded-xl shadow-sm border p-6 text-center ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <div className="text-3xl font-bold text-orange-600 mb-2">23</div>
            <div className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Saved Notes</div>
          </div>
        </div>

        {/* Filters */}
        <div className={`rounded-xl shadow-sm border p-6 mb-6 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className={`border rounded-lg px-4 py-2 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <select 
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className={`border rounded-lg px-4 py-2 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              >
                {timeFilters.map(filter => (
                  <option key={filter} value={filter}>{filter}</option>
                ))}
              </select>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center space-x-2">
              <Download className="w-4 h-4" /><span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Conversations */}
        <div className={`rounded-xl shadow-sm border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className={`p-6 border-b ${
            isDarkMode ? 'border-gray-600' : 'border-gray-200'
          }`}>
            <h3 className={`text-xl font-bold ${
              isDarkMode 
                ? 'text-white' 
                : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'
            }`}>Conversation History</h3>
          </div>
          <div className={`divide-y ${
            isDarkMode ? 'divide-gray-600' : 'divide-gray-200'
          }`}>
            {conversations.map(conversation => (
              <div key={conversation.id} className={`p-6 ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <MessageCircle className="w-8 h-8 text-blue-600 mt-1" />
                    <div>
                      <h4 className={`font-semibold text-lg mb-1 ${
                        isDarkMode 
                          ? 'text-white' 
                          : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'
                      }`}>{conversation.title}</h4>
                      <div className={`flex items-center space-x-4 text-sm mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{conversation.subject}</span>
                        <span>{conversation.date}</span>
                      </div>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {conversation.messages} messages • {conversation.savedExplanations} saved explanations
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 font-medium flex items-center space-x-1">
                    <Eye className="w-4 h-4" /><span>View</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;