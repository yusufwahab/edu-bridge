import React, { useState } from 'react';
import { User, Brain, Star, Heart, DollarSign, MapPin, Users, CheckCircle } from 'lucide-react';

const CareerAssessment = ({ onComplete }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({
    personality: {},
    skills: {},
    values: {},
    constraints: {}
  });
  const [showResults, setShowResults] = useState(false);

  const sections = [
    {
      title: 'Personality Profile',
      icon: <Brain className="w-6 h-6" />,
      description: 'Discover your work style and preferences',
      questions: [
        {
          id: 'problem_solving',
          question: 'When facing a complex problem, you prefer to:',
          options: [
            { text: 'Break it down into logical steps and analyze data', type: 'analytical' },
            { text: 'Brainstorm creative solutions with others', type: 'creative' },
            { text: 'Research what others have done successfully', type: 'social' },
            { text: 'Build a prototype or test different approaches', type: 'technical' }
          ]
        },
        {
          id: 'work_environment',
          question: 'Your ideal work environment is:',
          options: [
            { text: 'Quiet office with data and research materials', type: 'analytical' },
            { text: 'Dynamic space with room for creativity and collaboration', type: 'creative' },
            { text: 'Community-focused setting helping people', type: 'social' },
            { text: 'Lab or workshop with tools and technology', type: 'technical' }
          ]
        },
        {
          id: 'motivation',
          question: 'What motivates you most in your work?',
          options: [
            { text: 'Solving complex puzzles and finding patterns', type: 'analytical' },
            { text: 'Creating something new and innovative', type: 'creative' },
            { text: 'Making a positive impact on people\'s lives', type: 'social' },
            { text: 'Building and improving systems or products', type: 'technical' }
          ]
        },
        {
          id: 'decision_making',
          question: 'When making important decisions, you:',
          options: [
            { text: 'Gather data and analyze all options carefully', type: 'analytical' },
            { text: 'Trust your intuition and consider creative possibilities', type: 'creative' },
            { text: 'Consult with others and consider social impact', type: 'social' },
            { text: 'Test different approaches and see what works', type: 'technical' }
          ]
        },
        {
          id: 'success_definition',
          question: 'Success for you means:',
          options: [
            { text: 'Being recognized as an expert in your field', type: 'analytical' },
            { text: 'Creating something that inspires others', type: 'creative' },
            { text: 'Helping others achieve their goals', type: 'social' },
            { text: 'Building something that works efficiently', type: 'technical' }
          ]
        }
      ]
    },
    {
      title: 'Skills & Interests',
      icon: <Star className="w-6 h-6" />,
      description: 'Identify your strengths and passions',
      questions: [
        {
          id: 'best_subjects',
          question: 'Which JAMB subjects are you strongest in?',
          options: [
            { text: 'Mathematics and Physics', type: 'technical' },
            { text: 'English and Literature', type: 'creative' },
            { text: 'Biology and Chemistry', type: 'analytical' },
            { text: 'Government and Economics', type: 'social' }
          ]
        },
        {
          id: 'extracurricular',
          question: 'Your favorite extracurricular activities include:',
          options: [
            { text: 'Debate club, math olympiad, science competitions', type: 'analytical' },
            { text: 'Drama, art club, creative writing, music', type: 'creative' },
            { text: 'Student government, community service, peer tutoring', type: 'social' },
            { text: 'Robotics club, computer programming, engineering projects', type: 'technical' }
          ]
        },
        {
          id: 'learning_style',
          question: 'You learn best when:',
          options: [
            { text: 'Reading research papers and analyzing case studies', type: 'analytical' },
            { text: 'Working on creative projects and presentations', type: 'creative' },
            { text: 'Discussing ideas in groups and teaching others', type: 'social' },
            { text: 'Doing hands-on experiments and building things', type: 'technical' }
          ]
        }
      ]
    },
    {
      title: 'Values & Priorities',
      icon: <Heart className="w-6 h-6" />,
      description: 'What matters most to you in a career',
      questions: [
        {
          id: 'salary_importance',
          question: 'How important is high salary to you?',
          options: [
            { text: 'Very important - I want financial security', type: 'business' },
            { text: 'Somewhat important - decent pay is enough', type: 'balanced' },
            { text: 'Not very important - passion matters more', type: 'passion' }
          ]
        },
        {
          id: 'work_life_balance',
          question: 'Your ideal work-life balance is:',
          options: [
            { text: 'Work hard now, enjoy later - willing to sacrifice for success', type: 'ambitious' },
            { text: 'Balanced approach - work hard but have time for family', type: 'balanced' },
            { text: 'Life first - work should not dominate my time', type: 'lifestyle' }
          ]
        },
        {
          id: 'impact_preference',
          question: 'The kind of impact you want to make:',
          options: [
            { text: 'Help individuals directly (patients, students, clients)', type: 'social' },
            { text: 'Create products or services that benefit many people', type: 'technical' },
            { text: 'Advance knowledge and understanding in your field', type: 'analytical' },
            { text: 'Build businesses that create jobs and economic growth', type: 'business' }
          ]
        },
        {
          id: 'location_preference',
          question: 'Where do you see yourself working?',
          options: [
            { text: 'Major Nigerian cities (Lagos, Abuja, Port Harcourt)', type: 'urban' },
            { text: 'Anywhere in Nigeria where opportunities exist', type: 'flexible' },
            { text: 'Internationally - open to working abroad', type: 'global' },
            { text: 'My home state/region - want to contribute locally', type: 'local' }
          ]
        }
      ]
    },
    {
      title: 'Constraints & Reality Check',
      icon: <MapPin className="w-6 h-6" />,
      description: 'Consider practical factors',
      questions: [
        {
          id: 'family_expectations',
          question: 'Your family\'s career expectations are:',
          options: [
            { text: 'Very supportive - they want me to follow my passion', type: 'supportive' },
            { text: 'Traditional - they prefer medicine, law, or engineering', type: 'traditional' },
            { text: 'Practical - they want financial stability above all', type: 'practical' },
            { text: 'Mixed - some support, some pressure for certain careers', type: 'mixed' }
          ]
        },
        {
          id: 'financial_situation',
          question: 'Your family\'s financial situation for university:',
          options: [
            { text: 'Comfortable - can afford any university and course', type: 'comfortable' },
            { text: 'Moderate - need to consider costs but have options', type: 'moderate' },
            { text: 'Tight - need scholarships or affordable options', type: 'constrained' },
            { text: 'Very difficult - must find fully funded opportunities', type: 'limited' }
          ]
        },
        {
          id: 'jamb_confidence',
          question: 'Your expected JAMB score range:',
          options: [
            { text: '300+ - Confident about top universities', type: 'high' },
            { text: '250-299 - Good chances at most universities', type: 'good' },
            { text: '200-249 - Need to choose universities carefully', type: 'moderate' },
            { text: '150-199 - Limited options, need backup plans', type: 'limited' }
          ]
        }
      ]
    }
  ];

  const handleAnswer = (questionId, option) => {
    const sectionKey = ['personality', 'skills', 'values', 'constraints'][currentSection];
    setAnswers(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [questionId]: option
      }
    }));
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      calculateResults();
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const calculateResults = () => {
    const scores = {
      analytical: 0,
      creative: 0,
      social: 0,
      technical: 0,
      business: 0
    };

    // Calculate personality scores
    Object.values(answers.personality).forEach(answer => {
      if (scores.hasOwnProperty(answer.type)) {
        scores[answer.type] += 2;
      }
    });

    // Calculate skills scores
    Object.values(answers.skills).forEach(answer => {
      if (scores.hasOwnProperty(answer.type)) {
        scores[answer.type] += 1.5;
      }
    });

    // Add business orientation from values
    Object.values(answers.values).forEach(answer => {
      if (answer.type === 'business') {
        scores.business += 1;
      }
    });

    // Normalize scores to percentages
    const maxScore = Math.max(...Object.values(scores));
    const normalizedScores = {};
    Object.keys(scores).forEach(key => {
      normalizedScores[key] = Math.round((scores[key] / maxScore) * 100);
    });

    const results = {
      scores: normalizedScores,
      dominant: Object.keys(normalizedScores).reduce((a, b) => 
        normalizedScores[a] > normalizedScores[b] ? a : b
      ),
      answers,
      completedAt: new Date().toISOString()
    };

    localStorage.setItem('careerAssessment', JSON.stringify(results));
    setShowResults(true);
    onComplete && onComplete(results);
  };

  const getProgress = () => {
    const currentQuestions = sections[currentSection].questions;
    const sectionKey = ['personality', 'skills', 'values', 'constraints'][currentSection];
    const answeredCount = Object.keys(answers[sectionKey]).length;
    return (answeredCount / currentQuestions.length) * 100;
  };

  const getTotalProgress = () => {
    const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
    const totalAnswered = Object.values(answers).reduce((sum, section) => sum + Object.keys(section).length, 0);
    return (totalAnswered / totalQuestions) * 100;
  };

  const canProceed = () => {
    const currentQuestions = sections[currentSection].questions;
    const sectionKey = ['personality', 'skills', 'values', 'constraints'][currentSection];
    return Object.keys(answers[sectionKey]).length === currentQuestions.length;
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Assessment Complete!</h1>
              <p className="text-gray-600">Your career profile has been generated</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Your Career Profile</h2>
              <p className="text-gray-700">
                Based on your responses, we've identified your strengths and preferences. 
                This will help us recommend the best career paths for you.
              </p>
            </div>

            <button
              onClick={() => onComplete && onComplete()}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              See My Career Matches 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentSectionData = sections[currentSection];
  const sectionKey = ['personality', 'skills', 'values', 'constraints'][currentSection];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Career Assessment</h1>
            <p className="text-gray-600">Discover your ideal career path in 10-15 minutes</p>
          </div>

          {/* Overall Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Overall Progress</span>
              <span>{Math.round(getTotalProgress())}% Complete</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getTotalProgress()}%` }}
              ></div>
            </div>
          </div>

          {/* Section Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {sections.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSection ? 'bg-indigo-600' :
                    index < currentSection ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Current Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-full flex items-center justify-center text-white">
                {currentSectionData.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{currentSectionData.title}</h2>
                <p className="text-gray-600">{currentSectionData.description}</p>
              </div>
            </div>

            {/* Section Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Section Progress</span>
                <span>{Math.round(getProgress())}% Complete</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgress()}%` }}
                ></div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {currentSectionData.questions.map((question, qIndex) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {qIndex + 1}. {question.question}
                  </h3>
                  <div className="space-y-3">
                    {question.options.map((option, oIndex) => (
                      <button
                        key={oIndex}
                        onClick={() => handleAnswer(question.id, option)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          answers[sectionKey][question.id]?.text === option.text
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            answers[sectionKey][question.id]?.text === option.text
                              ? 'border-indigo-500 bg-indigo-500'
                              : 'border-gray-300'
                          }`}>
                            {answers[sectionKey][question.id]?.text === option.text && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="font-medium">{option.text}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevSection}
              disabled={currentSection === 0}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Previous
            </button>
            <button
              onClick={nextSection}
              disabled={!canProceed()}
              className="px-6 py-3 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {currentSection === sections.length - 1 ? 'Complete Assessment' : 'Next Section'}
            </button>
          </div>

          {/* Time Estimate */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>Estimated time remaining: {Math.max(1, 15 - Math.round(getTotalProgress() * 0.15))} minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerAssessment;