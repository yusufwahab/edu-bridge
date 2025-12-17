import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Mic, Volume2, Play, FileText } from 'lucide-react';
import { textToSpeech } from '../utils/textToSpeech';

const VoicePage = ({ onBack }) => {
  const { isDarkMode } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSessions, setVoiceSessions] = useState([
    { id: 1, query: "Explain quadratic equations", time: "2 minutes ago", duration: "3:45" },
    { id: 2, query: "Quiz me on Biology", time: "15 minutes ago", duration: "5:20" },
    { id: 3, query: "Help with Chemistry formulas", time: "1 hour ago", duration: "2:15" }
  ]);

  const startVoiceRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const newSession = {
        id: Date.now(),
        query: "New voice query",
        time: "Just now",
        duration: "2:30"
      };
      setVoiceSessions(prev => [newSession, ...prev]);
    }, 3000);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`shadow-sm border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-6 py-4">
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
            }`}>Voice Tutor</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Voice Interface */}
        <div className={`rounded-xl shadow-sm border p-8 mb-8 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <Mic className="w-16 h-16 text-indigo-600 mb-6" />
          <h2 className={`text-3xl font-bold mb-4 ${
            isDarkMode 
              ? 'text-white' 
              : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'
          }`}>Speak Naturally</h2>
          <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Ask questions and get instant explanations through voice</p>
          <div className="text-center">
          
          <button 
            onClick={() => textToSpeech('Welcome to Voice Tutor. Press the button below to speak and get instant explanations.')}
            className={`mb-6 flex items-center mx-auto space-x-2 ${
              isDarkMode 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            <Volume2 className="w-4 h-4" /><span>Hear instructions</span>
          </button>
          
          <button
            onClick={startVoiceRecording}
            className={`w-40 h-40 rounded-full text-white text-xl font-semibold transition-all shadow-lg ${
              isRecording 
                ? 'bg-red-500 animate-pulse scale-110' 
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
            }`}
          >
            {isRecording ? 'Listening...' : 'Hold to Speak'}
          </button>
          
          <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {isRecording ? 'Speak now...' : 'Press and hold to start speaking'}
          </p>
          </div>
        </div>

        {/* Voice Sessions History */}
        <div className={`rounded-xl shadow-sm border p-6 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <h3 className={`text-xl font-bold mb-6 ${
            isDarkMode 
              ? 'text-white' 
              : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'
          }`}>Recent Voice Sessions</h3>
          <div className="space-y-4">
            {voiceSessions.map(session => (
              <div key={session.id} className={`border rounded-lg p-4 ${
                isDarkMode 
                  ? 'border-gray-600 hover:bg-gray-700' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Mic className="w-6 h-6 text-indigo-600" />
                    <div>
                      <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>"{session.query}"</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{session.time} • Duration: {session.duration}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 flex items-center space-x-1">
                      <Play className="w-3 h-3" /><span>Replay</span>
                    </button>
                    <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 flex items-center space-x-1">
                      <FileText className="w-3 h-3" /><span>Transcript</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoicePage;