import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ChatPage from './ChatPage';
import UploadPage from './UploadPage';
import VoicePage from './VoicePage';
import HistoryPage from './HistoryPage';
import chatImage from '../assets/chat.jpg';
import uploadImage from '../assets/upload.jpg';
import voiceImage from '../assets/voice.jpg';
import historyImage from '../assets/history.jpg';

const StudyBuddyPage = () => {
  const { isDarkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState('');

  if (currentPage === 'chat') {
    return <ChatPage onBack={() => setCurrentPage('')} />;
  }
  
  if (currentPage === 'upload') {
    return <UploadPage onBack={() => setCurrentPage('')} />;
  }
  
  if (currentPage === 'voice') {
    return <VoicePage onBack={() => setCurrentPage('')} />;
  }
  
  if (currentPage === 'history') {
    return <HistoryPage onBack={() => setCurrentPage('')} />;
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <h1 className={`text-2xl sm:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Study Buddy Features</h1>
          <p className={`text-lg sm:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Choose how you want to learn today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {/* Chat Feature */}
          <div 
            onClick={() => setCurrentPage('chat')}
            className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300`}
          >
            <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center overflow-hidden">
              <img src={chatImage} alt="Chat" className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Chat</h3>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Have conversations with your AI tutor. Get instant explanations adapted to your learning style in multiple Nigerian languages.
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                Start Chatting <span className="ml-2">→</span>
              </div>
            </div>
          </div>

          {/* Upload Notes Feature */}
          <div 
            onClick={() => setCurrentPage('upload')}
            className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300`}
          >
            <div className="h-48 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center overflow-hidden">
              <img src={uploadImage} alt="Upload Notes" className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Upload Notes</h3>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Transform your notes into interactive study materials. Upload PDFs, photos, or handwritten notes to generate flashcards and quizzes.
              </p>
              <div className="flex items-center text-green-600 font-medium">
                Upload Files <span className="ml-2">→</span>
              </div>
            </div>
          </div>

          {/* Voice Tutor Feature */}
          <div 
            onClick={() => setCurrentPage('voice')}
            className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300`}
          >
            <div className="h-48 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden">
              <img src={voiceImage} alt="Voice Tutor" className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Voice Tutor</h3>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Speak naturally and get instant explanations. Perfect for auditory learners who prefer voice interactions over typing.
              </p>
              <div className="flex items-center text-indigo-600 font-medium">
                Start Speaking <span className="ml-2">→</span>
              </div>
            </div>
          </div>

          {/* History Feature */}
          <div 
            onClick={() => setCurrentPage('history')}
            className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300`}
          >
            <div className="h-48 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center overflow-hidden">
              <img src={historyImage} alt="History" className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>History</h3>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Review your past conversations and study sessions. Export your learning progress and revisit important explanations.
              </p>
              <div className="flex items-center text-orange-600 font-medium">
                View History <span className="ml-2">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyBuddyPage;