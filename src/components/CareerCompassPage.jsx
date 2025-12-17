import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import CareerAssessment from './CareerAssessment';
import CareerMatchingEngine from './CareerMatchingEngine';
import CareerRoadmapGenerator from './CareerRoadmapGenerator';
import { MapPin, User, Briefcase, ArrowRight } from 'lucide-react';

const CareerCompassPage = () => {
  const { isDarkMode } = useTheme();
  const [currentView, setCurrentView] = useState('overview');
  const [assessmentResults, setAssessmentResults] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('careerAssessment');
    if (stored) {
      setAssessmentResults(JSON.parse(stored));
    }
  }, []);

  if (currentView === 'assessment') {
    return (
      <CareerAssessment
        onComplete={(results) => {
          setAssessmentResults(results);
          setCurrentView('matching');
        }}
      />
    );
  }

  if (currentView === 'matching') {
    return (
      <div className="p-6">
        <button
          onClick={() => setCurrentView('overview')}
          className={`mb-4 font-semibold ${
            isDarkMode 
              ? 'text-blue-400 hover:text-blue-300' 
              : 'text-indigo-600 hover:text-indigo-700'
          }`}
        >
          ← Back to Career Compass
        </button>
        <CareerMatchingEngine
          assessmentResults={assessmentResults}
          apiKey="demo_key"
        />
      </div>
    );
  }

  if (currentView === 'roadmap') {
    return (
      <div className="p-6">
        <button
          onClick={() => setCurrentView('overview')}
          className={`mb-4 font-semibold ${
            isDarkMode 
              ? 'text-blue-400 hover:text-blue-300' 
              : 'text-indigo-600 hover:text-indigo-700'
          }`}
        >
          ← Back to Career Compass
        </button>
        <CareerRoadmapGenerator
          selectedCareer={{ career: 'Software Engineer' }}
          assessmentResults={assessmentResults}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${
              isDarkMode 
                ? 'text-white' 
                : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'
            }`}>Career Compass</h1>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>AI-powered career guidance for Nigerian students</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className={`rounded-xl shadow-sm border p-6 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDarkMode 
                ? 'bg-blue-600/20' 
                : 'bg-blue-100'
            }`}>
              <User className={`w-5 h-5 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <h3 className={`text-lg font-bold ${
              isDarkMode 
                ? 'text-white' 
                : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'
            }`}>Career Assessment</h3>
          </div>
          
          {assessmentResults ? (
            <div>
              <p className="text-green-600 font-medium mb-2">✓ Assessment completed</p>
              <p className={`text-sm mb-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Dominant type: {assessmentResults.dominant}
              </p>
              <button
                onClick={() => setCurrentView('assessment')}
                className={`text-sm font-medium ${
                  isDarkMode 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-indigo-600 hover:text-indigo-700'
                }`}
              >
                Retake Assessment
              </button>
            </div>
          ) : (
            <div>
              <p className={`text-sm mb-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Take a comprehensive assessment to discover your ideal career path.
              </p>
              <button
                onClick={() => setCurrentView('assessment')}
                className="w-full bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800 text-white py-2 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                Start Assessment <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className={`rounded-xl shadow-sm border p-6 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDarkMode 
                ? 'bg-green-600/20' 
                : 'bg-green-100'
            }`}>
              <Briefcase className={`w-5 h-5 ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`} />
            </div>
            <h3 className={`text-lg font-bold ${
              isDarkMode 
                ? 'text-white' 
                : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'
            }`}>Career Matching</h3>
          </div>
          
          <p className={`text-sm mb-4 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Get AI-powered career recommendations based on your assessment.
          </p>
          <button
            onClick={() => setCurrentView('matching')}
            disabled={!assessmentResults}
            className="w-full bg-gradient-to-br from-gray-800 via-blue-800 to-indigo-800 hover:from-gray-700 hover:via-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            View Matches <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className={`rounded-xl shadow-sm border p-6 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDarkMode 
                ? 'bg-indigo-600/20' 
                : 'bg-indigo-100'
            }`}>
              <MapPin className={`w-5 h-5 ${
                isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
              }`} />
            </div>
            <h3 className={`text-lg font-bold ${
              isDarkMode 
                ? 'text-white' 
                : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'
            }`}>Career Roadmap</h3>
          </div>
          
          <p className={`text-sm mb-4 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Get a personalized roadmap from where you are to your dream career.
          </p>
          <button
            onClick={() => setCurrentView('roadmap')}
            className="w-full bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800 text-white py-2 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            View Roadmap <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Career Insights */}
      <div className={`mt-8 rounded-xl shadow-sm border p-6 ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-100'
      }`}>
        <h2 className={`text-xl font-bold mb-4 ${
          isDarkMode 
            ? 'text-white' 
            : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'
        }`}>Career Insights</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`rounded-lg p-4 ${
            isDarkMode ? 'bg-blue-600/20' : 'bg-blue-50'
          }`}>
            <h3 className={`font-semibold mb-2 ${
              isDarkMode ? 'text-blue-300' : 'text-blue-800'
            }`}>🇳🇬 Nigerian Job Market</h3>
            <p className={`text-sm ${
              isDarkMode ? 'text-blue-200' : 'text-blue-700'
            }`}>
              Tech sector growing at 15% annually. High demand for software engineers, 
              data scientists, and digital marketers.
            </p>
          </div>
          <div className={`rounded-lg p-4 ${
            isDarkMode ? 'bg-green-600/20' : 'bg-green-50'
          }`}>
            <h3 className={`font-semibold mb-2 ${
              isDarkMode ? 'text-green-300' : 'text-green-800'
            }`}>💡 Career Tip</h3>
            <p className={`text-sm ${
              isDarkMode ? 'text-green-200' : 'text-green-700'
            }`}>
              Start building your portfolio early. Nigerian employers value 
              practical skills and real-world projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerCompassPage;