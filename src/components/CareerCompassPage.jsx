import React, { useState, useEffect } from 'react';
import CareerAssessment from './CareerAssessment';
import CareerMatchingEngine from './CareerMatchingEngine';
import CareerRoadmapGenerator from './CareerRoadmapGenerator';
import { MapPin, User, Briefcase, ArrowRight } from 'lucide-react';

const CareerCompassPage = () => {
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
          className="mb-4 text-indigo-600 hover:text-indigo-700 font-semibold"
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
          className="mb-4 text-indigo-600 hover:text-indigo-700 font-semibold"
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Career Compass</h1>
            <p className="text-gray-600">AI-powered career guidance for Nigerian students</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Career Assessment</h3>
          </div>
          
          {assessmentResults ? (
            <div>
              <p className="text-green-600 font-medium mb-2">✓ Assessment completed</p>
              <p className="text-sm text-gray-600 mb-4">
                Dominant type: {assessmentResults.dominant}
              </p>
              <button
                onClick={() => setCurrentView('assessment')}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                Retake Assessment
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 text-sm mb-4">
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Career Matching</h3>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Career Roadmap</h3>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">
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
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">Career Insights</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">🇳🇬 Nigerian Job Market</h3>
            <p className="text-blue-700 text-sm">
              Tech sector growing at 15% annually. High demand for software engineers, 
              data scientists, and digital marketers.
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">💡 Career Tip</h3>
            <p className="text-green-700 text-sm">
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