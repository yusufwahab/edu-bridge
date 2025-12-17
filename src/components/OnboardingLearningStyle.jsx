import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { textToSpeech } from '../utils/textToSpeech';
import { Trophy, Brain, Zap } from 'lucide-react';

const OnboardingLearningStyle = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const questions = [
    {
      question: "When learning about photosynthesis, what helps you understand best?",
      options: [
        { text: "Colorful diagrams showing the process", type: "Visual" },
        { text: "Teacher explaining step by step", type: "Auditory" },
        { text: "Doing a hands-on experiment with plants", type: "Kinesthetic" },
        { text: "Reading detailed notes about the process", type: "Reading" }
      ]
    },
    {
      question: "How do you prefer to study for Mathematics?",
      options: [
        { text: "Using charts, graphs, and visual formulas", type: "Visual" },
        { text: "Discussing problems with friends", type: "Auditory" },
        { text: "Solving many practice problems", type: "Kinesthetic" },
        { text: "Reading textbooks and taking notes", type: "Reading" }
      ]
    },
    {
      question: "When memorizing English vocabulary, you:",
      options: [
        { text: "Create colorful flashcards with pictures", type: "Visual" },
        { text: "Say the words out loud repeatedly", type: "Auditory" },
        { text: "Write the words multiple times", type: "Kinesthetic" },
        { text: "Read the definitions several times", type: "Reading" }
      ]
    },
    {
      question: "In Chemistry class, you understand reactions better when:",
      options: [
        { text: "Watching animated molecular models", type: "Visual" },
        { text: "Teacher explains what's happening", type: "Auditory" },
        { text: "Mixing chemicals in the lab", type: "Kinesthetic" },
        { text: "Reading about the reaction mechanisms", type: "Reading" }
      ]
    },
    {
      question: "When preparing for JAMB, your ideal study environment is:",
      options: [
        { text: "Quiet room with colorful notes and diagrams", type: "Visual" },
        { text: "Study group where you can discuss", type: "Auditory" },
        { text: "Moving around while studying", type: "Kinesthetic" },
        { text: "Library with lots of textbooks", type: "Reading" }
      ]
    }
  ];

  const handleAnswer = (option) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      analyzeResults(newAnswers);
    }
  };

  const analyzeResults = async (allAnswers) => {
    setIsAnalyzing(true);
    
    const counts = { Visual: 0, Auditory: 0, Kinesthetic: 0, Reading: 0 };
    allAnswers.forEach(answer => {
      counts[answer.type]++;
    });

    const total = allAnswers.length;
    const percentages = {};
    Object.keys(counts).forEach(type => {
      percentages[type] = Math.round((counts[type] / total) * 100);
    });

    const dominantStyle = Object.keys(percentages).reduce((a, b) => 
      percentages[a] > percentages[b] ? a : b
    );

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
            content: `Analyze this Nigerian student's learning style quiz results: ${JSON.stringify(percentages)}. 
            Dominant style: ${dominantStyle}. 
            Provide a brief, encouraging explanation (2-3 sentences) of what this means for their JAMB/WAEC preparation. 
            Be specific about how this will help them learn better. Use Nigerian context and be motivational.`
          }],
          temperature: 0.7,
          max_tokens: 200
        })
      });

      const data = await response.json();
      const aiExplanation = data.choices[0].message.content;

      setResults({
        percentages,
        dominantStyle,
        explanation: aiExplanation
      });
    } catch (error) {
      console.error('Error analyzing results:', error);
      setResults({
        percentages,
        dominantStyle,
        explanation: `You're primarily a ${dominantStyle} learner! This means you learn best through ${dominantStyle.toLowerCase()} methods. I'll adapt my teaching style to help you excel in your exams.`
      });
    }

    setIsAnalyzing(false);
  };

  const handleNext = () => {
    const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    localStorage.setItem('onboardingData', JSON.stringify({
      ...onboardingData,
      learningStyle: results
    }));
    navigate('/onboarding/career-assessment');
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
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center animate-bounce">
                <Brain className="w-12 h-12 text-white animate-pulse" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Analyzing Your Learning Style...</h2>
            <p className="text-gray-300 text-lg">AI is processing your responses to create your personalized learning profile</p>
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
                <span className="text-sm font-medium text-gray-300">Step 2 of 4</span>
                <button onClick={handleSkip} className="text-sm text-gray-400 hover:text-white transition-colors">
                  Skip career assessment
                </button>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full w-2/4 shadow-lg"></div>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl animate-pulse"></div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">Your Learning Style Results!</h1>
              <p className="text-gray-300 text-lg">Discover how you learn best</p>
            </div>

            {/* Results */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Your Learning Profile:</h3>
                
                {Object.entries(results.percentages).map(([style, percentage]) => (
                  <div key={style} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-white text-lg">{style}</span>
                      <span className="text-lg font-bold text-white">{percentage}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full shadow-lg transition-all duration-1000 ${
                          style === 'Visual' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                          style === 'Auditory' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          style === 'Kinesthetic' ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
                <h4 className="text-xl font-bold text-white mb-4">What This Means for You:</h4>
                <p className="text-blue-200 leading-relaxed text-lg">{results.explanation}</p>
                <button 
                  onClick={() => textToSpeech(results.explanation)}
                  className="mt-4 text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-2 transition-colors"
                >
                  <span>🔊</span>
                  <span>Listen to explanation</span>
                </button>
              </div>

              <div className="bg-green-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
                <div className="flex items-center justify-center space-x-3">
                  <Trophy className="w-6 h-6 text-green-400" />
                  <p className="text-green-300 font-bold text-lg">
                    I'll now adapt my teaching style to help you learn better!
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Continue to Career Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse delay-700"></div>
        <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-yellow-500/10 rounded-full blur-lg animate-pulse delay-300"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-white/20 rounded-full animate-ping delay-1000"></div>
        <div className="absolute top-3/4 left-1/4 w-1 h-1 bg-white/30 rounded-full animate-ping delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-white/10 rounded-full animate-ping delay-1500"></div>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-2xl border border-white/20">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-300">Step 2 of 4</span>
              <button onClick={handleSkip} className="text-sm text-gray-400 hover:text-white transition-colors">
                Skip for now
              </button>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full w-2/4 shadow-lg"></div>
            </div>
          </div>

          {/* Question Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-300">Question {currentQuestion + 1} of {questions.length}</span>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-400 font-medium">Learning Style Detection</span>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left p-6 bg-white/5 border-2 border-white/20 rounded-2xl hover:border-purple-400 hover:bg-white/10 transition-all duration-300 group transform hover:scale-105"
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 border-2 border-white/40 rounded-full mr-4 group-hover:border-purple-400 flex items-center justify-center transition-colors">
                      <div className="w-3 h-3 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-white group-hover:text-purple-200 font-medium">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Back Button */}
          {currentQuestion > 0 && (
            <button
              onClick={() => {
                setCurrentQuestion(currentQuestion - 1);
                setAnswers(answers.slice(0, -1));
              }}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              ← Previous Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingLearningStyle;