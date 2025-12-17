import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Save, RotateCcw, Mic, Paperclip, Send } from 'lucide-react';
import { textToSpeech } from '../utils/textToSpeech';

const ChatPage = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your Study Buddy AI. I've adapted to your learning style. How can I help you study today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [learningStyle, setLearningStyle] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [ttsLoading, setTtsLoading] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const languages = ['English', 'Yoruba', 'Igbo', 'Hausa', 'Pidgin'];

  useEffect(() => {
    const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    if (onboardingData.learningStyle) {
      setLearningStyle(onboardingData.learningStyle);
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
              content: `You are an adaptive Nigerian tutor. Student's learning style: ${learningStyle ? `${learningStyle.dominantStyle} (${learningStyle.percentages[learningStyle.dominantStyle]}%)` : 'Mixed'}. 
              Adapt explanations accordingly:
              - Visual: Use diagrams, charts, visual metaphors
              - Auditory: Use discussions, verbal explanations, sound analogies
              - Kinesthetic: Use hands-on examples, movement, practical applications
              - Reading: Use detailed text, lists, written examples
              
              Use Nigerian context (WAEC, JAMB, Nigerian universities, local examples). 
              Language: ${selectedLanguage}. Be encouraging and relatable.`
            },
            { role: 'user', content: inputMessage }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const data = await response.json();
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.choices[0].message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I had trouble processing that. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const voiceMessage = {
        id: Date.now(),
        type: 'ai',
        content: "I heard you ask about quadratic equations. Let me explain using your visual learning style with diagrams and examples...",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, voiceMessage]);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 flex items-center font-medium"
              >
                ← Back to Features
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-semibold text-gray-900">Study Buddy AI</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Style: {learningStyle ? `${learningStyle.dominantStyle}` : 'Adaptive'}
              </div>
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
          {messages.map(message => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs sm:max-w-2xl px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-sm ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-900 border'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                {message.type === 'ai' && (
                  <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-gray-100">
                    <button 
                      onClick={async () => {
                        setTtsLoading(message.id);
                        await textToSpeech(message.content);
                        setTtsLoading(null);
                      }}
                      disabled={ttsLoading === message.id}
                      className="text-xs text-gray-500 hover:text-blue-600 flex items-center space-x-1 disabled:opacity-50"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{ttsLoading === message.id ? 'Loading...' : 'Listen'}</span>
                    </button>
                    <button className="text-xs text-gray-500 hover:text-blue-600 flex items-center space-x-1">
                      <Save className="w-3 h-3" /><span>Save</span>
                    </button>
                    <button className="text-xs text-gray-500 hover:text-blue-600 flex items-center space-x-1">
                      <RotateCcw className="w-3 h-3" /><span>Rephrase</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-2xl px-6 py-4 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-3 sm:p-6">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder="Ask anything about your studies..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="2"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={startVoiceRecording}
                className={`p-3 rounded-xl transition-colors ${
                  isRecording ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
              >
                <Send className="w-4 h-4" /><span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        className="hidden"
      />
    </div>
  );
};

export default ChatPage;