import React, { useState, useEffect } from 'react';
import { Brain, Users, BarChart3, MapPin, ArrowRight, Star } from 'lucide-react';

// Import all the components
import LearningStyleDetection from './LearningStyleDetection';
import AdaptiveExplanationEngine from './AdaptiveExplanationEngine';
import StudyBuddyDashboard from './StudyBuddyDashboard';
import StudyPactCreation from './StudyPactCreation';
import StudyPactNotifications from './StudyPactNotifications';
import StudyLockMode from './StudyLockMode';
import ExamPredictionDashboard from './ExamPredictionDashboard';
import StudyPriorityGenerator from './StudyPriorityGenerator';
import CareerAssessment from './CareerAssessment';
import CareerMatchingEngine from './CareerMatchingEngine';
import CareerRoadmapGenerator from './CareerRoadmapGenerator';

const YabvilPrepDemo = () => {
  const [currentFeature, setCurrentFeature] = useState('overview');
  const [demoData, setDemoData] = useState({
    learningStyle: null,
    assessmentResults: null,
    selectedCareer: null,
    activePact: null
  });

  // Demo API key (in real app, this would be from environment variables)
  const DEMO_API_KEY = 'demo_key_for_hackathon';

  const features = [
    {
      id: 'study-buddy',
      title: 'Study Buddy AI',
      subtitle: 'Adaptive Learning',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      description: 'AI that adapts to your learning style with conversational memory',
      components: ['learning-style', 'adaptive-explanation', 'study-dashboard']
    },
    {
      id: 'study-pacts',
      title: 'Study Pacts',
      subtitle: 'Social Accountability',
      icon: <Users className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      description: 'Commit to study sessions with friends for accountability',
      components: ['pact-creation', 'notifications', 'lock-mode']
    },
    {
      id: 'exam-prediction',
      title: 'Exam Prediction Engine',
      subtitle: 'Smart Preparation',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'from-gray-900 via-blue-900 to-indigo-900',
      description: 'AI analyzes 15 years of past questions to predict likely topics',
      components: ['prediction-dashboard', 'priority-generator']
    },
    {
      id: 'career-compass',
      title: 'Career Compass',
      subtitle: 'Future Planning',
      icon: <MapPin className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      description: 'AI-powered career matching and personalized roadmaps',
      components: ['career-assessment', 'career-matching', 'roadmap-generator']
    }
  ];

  // Load demo data from localStorage
  useEffect(() => {
    const learningStyle = localStorage.getItem('learningStyle');
    const assessmentResults = localStorage.getItem('careerAssessment');
    
    if (learningStyle) {
      setDemoData(prev => ({ ...prev, learningStyle: JSON.parse(learningStyle) }));
    }
    
    if (assessmentResults) {
      setDemoData(prev => ({ ...prev, assessmentResults: JSON.parse(assessmentResults) }));
    }

    // Mock active pact for demo
    setDemoData(prev => ({
      ...prev,
      activePact: {
        id: 1,
        subject: 'JAMB Mathematics',
        date: new Date().toISOString().split('T')[0],
        time: '14:00',
        duration: 45,
        friends: [
          { name: 'Chidi Okafor', status: 'confirmed' },
          { name: 'Amaka Nwankwo', status: 'confirmed' }
        ]
      }
    }));
  }, []);

  const renderFeatureComponent = () => {
    switch (currentFeature) {
      // Study Buddy AI Components
      case 'learning-style':
        return (
          <LearningStyleDetection 
            onComplete={(results) => {
              setDemoData(prev => ({ ...prev, learningStyle: results }));
              setCurrentFeature('adaptive-explanation');
            }}
          />
        );
      
      case 'adaptive-explanation':
        return (
          <AdaptiveExplanationEngine
            topic="Quadratic Equations"
            userInterests={['Football', 'Music', 'Technology']}
            apiKey={DEMO_API_KEY}
          />
        );
      
      case 'study-dashboard':
        return <StudyBuddyDashboard />;

      // Study Pacts Components
      case 'pact-creation':
        return (
          <StudyPactCreation
            onPactCreated={(pact) => {
              setDemoData(prev => ({ ...prev, activePact: pact }));
              setCurrentFeature('notifications');
            }}
          />
        );
      
      case 'notifications':
        return (
          <StudyPactNotifications
            activePact={demoData.activePact}
            onStartStudy={() => setCurrentFeature('lock-mode')}
            onBreakPact={() => setCurrentFeature('overview')}
          />
        );
      
      case 'lock-mode':
        return (
          <StudyLockMode
            pact={demoData.activePact}
            onComplete={() => setCurrentFeature('overview')}
            onBreak={() => setCurrentFeature('overview')}
          />
        );

      // Exam Prediction Components
      case 'prediction-dashboard':
        return <ExamPredictionDashboard />;
      
      case 'priority-generator':
        return <StudyPriorityGenerator />;

      // Career Compass Components
      case 'career-assessment':
        return (
          <CareerAssessment
            onComplete={(results) => {
              setDemoData(prev => ({ ...prev, assessmentResults: results }));
              setCurrentFeature('career-matching');
            }}
          />
        );
      
      case 'career-matching':
        return (
          <CareerMatchingEngine
            assessmentResults={demoData.assessmentResults}
            apiKey={DEMO_API_KEY}
          />
        );
      
      case 'roadmap-generator':
        return (
          <CareerRoadmapGenerator
            selectedCareer={{ career: 'Software Engineer' }}
            assessmentResults={demoData.assessmentResults}
          />
        );

      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-full flex items-center justify-center mb-6">
            <Star className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            YabvilPrep 2.0
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            4 New AI-Powered Features for Quality Education (SDG 4)
          </p>
          <p className="text-gray-500">
            24-Hour Hackathon Demo • Built for Nigerian Students
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature) => (
            <div key={feature.id} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-white`}>
                  {feature.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{feature.title}</h2>
                  <p className="text-gray-600">{feature.subtitle}</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                {feature.description}
              </p>

              <div className="space-y-3">
                {feature.components.map((component, index) => (
                  <button
                    key={component}
                    onClick={() => setCurrentFeature(component)}
                    className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 flex items-center justify-between group"
                  >
                    <span className="font-medium text-gray-700 group-hover:text-indigo-700">
                      {component.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Demo Data Status */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Demo Status</h3>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className={`p-3 rounded-lg ${demoData.learningStyle ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-600'}`}>
              <div className="font-medium">Learning Style</div>
              <div>{demoData.learningStyle ? `${demoData.learningStyle.dominant} learner` : 'Not detected'}</div>
            </div>
            <div className={`p-3 rounded-lg ${demoData.assessmentResults ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-600'}`}>
              <div className="font-medium">Career Assessment</div>
              <div>{demoData.assessmentResults ? 'Completed' : 'Not completed'}</div>
            </div>
            <div className={`p-3 rounded-lg ${demoData.activePact ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-600'}`}>
              <div className="font-medium">Active Pact</div>
              <div>{demoData.activePact ? demoData.activePact.subject : 'None'}</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 text-blue-800">
              <div className="font-medium">Demo Mode</div>
              <div>All features available</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Built with React + Vite • TailwindCSS • Groq AI • Nigerian Context</p>
          <p className="mt-2">Addressing SDG 4: Quality Education for All</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {renderFeatureComponent()}
    </div>
  );
};

export default YabvilPrepDemo;