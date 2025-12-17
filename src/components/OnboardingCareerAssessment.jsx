import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { textToSpeech } from '../utils/textToSpeech';

const OnboardingCareerAssessment = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const sections = [
    {
      title: "Interests & Passions",
      questions: [
        {
          id: 'interests_1',
          question: "What activities do you enjoy most in your free time?",
          options: [
            "Building or fixing things",
            "Reading and researching",
            "Helping others solve problems",
            "Creating art or content",
            "Playing sports or games"
          ]
        },
        {
          id: 'interests_2',
          question: "Which school subjects excite you the most?",
          options: [
            "Mathematics and Physics",
            "Biology and Chemistry",
            "English and Literature",
            "Government and Economics",
            "Computer Science and Technology"
          ]
        }
      ]
    },
    {
      title: "Skills & Strengths",
      questions: [
        {
          id: 'skills_1',
          question: "What are you naturally good at?",
          options: [
            "Solving complex problems",
            "Communicating with people",
            "Leading and organizing",
            "Being creative and innovative",
            "Analyzing data and patterns"
          ]
        },
        {
          id: 'skills_2',
          question: "How do you prefer to work?",
          options: [
            "Alone, focusing deeply",
            "In small teams",
            "Leading large groups",
            "Helping individuals",
            "Collaborating with experts"
          ]
        }
      ]
    },
    {
      title: "Values & Motivation",
      questions: [
        {
          id: 'values_1',
          question: "What motivates you most about a future career?",
          options: [
            "High salary and financial security",
            "Making a positive impact on society",
            "Personal growth and learning",
            "Recognition and prestige",
            "Work-life balance and flexibility"
          ]
        },
        {
          id: 'values_2',
          question: "What kind of work environment appeals to you?",
          options: [
            "Modern office with latest technology",
            "Hospital or healthcare facility",
            "Outdoor or field work",
            "Creative studio or workshop",
            "Government or corporate building"
          ]
        }
      ]
    }
  ];

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      analyzeCareerFit();
    }
  };

  const analyzeCareerFit = async () => {
    setIsAnalyzing(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{
            role: 'user',
            content: `Analyze this Nigerian student's career assessment responses: ${JSON.stringify(answers)}. 
            Based on their interests, skills, and values, suggest 3 career paths that would be good fits. 
            Consider Nigerian job market, university requirements, and earning potential. 
            Format as JSON with: {"careers": [{"name": "Career Name", "match": 85, "description": "Brief description", "requirements": "Key requirements"}]}`
          }],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      try {
        const parsedResults = JSON.parse(aiResponse);
        setResults(parsedResults);
      } catch (parseError) {
        // Fallback if JSON parsing fails
        setResults({
          careers: [
            { name: "Software Engineering", match: 85, description: "Build apps and websites", requirements: "Computer Science degree" },
            { name: "Medicine", match: 78, description: "Help people stay healthy", requirements: "Medical degree" },
            { name: "Business Administration", match: 72, description: "Manage organizations", requirements: "Business degree" }
          ]
        });
      }
    } catch (error) {
      console.error('Error analyzing career fit:', error);
      setResults({
        careers: [
          { name: "Software Engineering", match: 85, description: "Build apps and websites", requirements: "Computer Science degree" },
          { name: "Medicine", match: 78, description: "Help people stay healthy", requirements: "Medical degree" },
          { name: "Business Administration", match: 72, description: "Manage organizations", requirements: "Business degree" }
        ]
      });
    }

    setIsAnalyzing(false);
  };

  const handleComplete = (selectedCareer = null) => {
    const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    localStorage.setItem('onboardingData', JSON.stringify({
      ...onboardingData,
      careerAssessment: { answers, results, selectedCareer }
    }));
    navigate('/onboarding/first-pact');
  };

  const handleSkip = () => {
    navigate('/onboarding/first-pact');
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="flex items-center justify-center min-h-screen relative z-10">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center border border-white/20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
            <h2 className="text-3xl font-bold text-white mb-4">Analyzing Your Career Fit...</h2>
            <p className="text-gray-300 text-lg">AI is matching you with perfect careers</p>
          </div>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
          <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse delay-700"></div>
        </div>

        <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-2xl border border-white/20">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-300">Step 3 of 4</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full w-3/4 shadow-lg"></div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-4xl font-bold text-white mb-4">Your Career Matches!</h1>
            <p className="text-gray-300 text-lg">Based on your interests and strengths</p>
          </div>

          <div className="space-y-4 mb-8">
            {results.careers.map((career, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6 hover:border-purple-400 transition-all hover:bg-white/15">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{career.name}</h3>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-purple-400">{career.match}%</span>
                    <span className="text-sm text-gray-400 ml-1">match</span>
                  </div>
                </div>
                <p className="text-gray-300 mb-3">{career.description}</p>
                <button 
                  onClick={() => textToSpeech(`${career.name}: ${career.description}. Requirements: ${career.requirements}`)}
                  className="text-purple-400 hover:text-purple-300 text-xs mb-2 flex items-center transition-colors"
                >
                  🔊 Listen
                </button>
                <p className="text-sm text-gray-400 mb-4">
                  <strong className="text-gray-300">Requirements:</strong> {career.requirements}
                </p>
                <button
                  onClick={() => handleComplete(career)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  Choose This Path
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleComplete()}
              className="w-full bg-white/10 border-2 border-white/20 text-white py-3 px-6 rounded-xl font-bold hover:bg-white/20 transition-all"
            >
              I'll Decide Later
            </button>
            <button
              onClick={handleSkip}
              className="w-full text-gray-400 hover:text-white font-medium transition-colors"
            >
              Skip Career Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
    );
  }

  const currentQuestions = sections[currentSection].questions;
  const sectionAnswers = currentQuestions.filter(q => answers[q.id]).length;
  const canProceed = sectionAnswers === currentQuestions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse delay-700"></div>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-2xl border border-white/20">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-300">Step 3 of 4</span>
            <button onClick={handleSkip} className="text-sm text-gray-400 hover:text-white transition-colors">
              Skip for now
            </button>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full w-3/4 shadow-lg"></div>
          </div>
        </div>

        {/* Section Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">
              Section {currentSection + 1} of {sections.length}: {sections[currentSection].title}
            </span>
            <span className="text-sm text-purple-400 font-medium">
              {sectionAnswers}/{currentQuestions.length} answered
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 shadow-lg"
              style={{ width: `${(sectionAnswers / currentQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🎓</div>
          <h1 className="text-3xl font-bold text-white mb-4">Career Interest Assessment</h1>
          <p className="text-gray-300 text-lg">Help us find careers that match your personality</p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {currentQuestions.map((question) => (
            <div key={question.id} className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{question.question}</h3>
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <label key={index} className="flex items-center cursor-pointer p-3 rounded-xl hover:bg-white/10 transition-all">
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={() => handleAnswer(question.id, option)}
                      className="mr-3 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          {currentSection > 0 && (
            <button
              onClick={() => setCurrentSection(currentSection - 1)}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              ← Previous Section
            </button>
          )}
          <div className="ml-auto">
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-2xl"
            >
              {currentSection === sections.length - 1 ? 'Get My Career Matches' : 'Next Section'}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default OnboardingCareerAssessment;