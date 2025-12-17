import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { textToSpeech } from '../utils/textToSpeech';

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
    
    // Count learning style preferences
    const counts = { Visual: 0, Auditory: 0, Kinesthetic: 0, Reading: 0 };
    allAnswers.forEach(answer => {
      counts[answer.type]++;
    });

    // Calculate percentages
    const total = allAnswers.length;
    const percentages = {};
    Object.keys(counts).forEach(type => {
      percentages[type] = Math.round((counts[type] / total) * 100);
    });

    // Find dominant style
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
    // Save learning style results
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
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">Analyzing Your Learning Style...</h2>
          <p className="text-gray-600">AI is processing your responses</p>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Step 2 of 4</span>
              <button onClick={handleSkip} className="text-sm text-gray-500 hover:text-gray-700">
                Skip career assessment
              </button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full w-2/4"></div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🧠</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">Your Learning Style Results!</h1>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 rounded-xl p-6">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">Your Learning Profile:</h3>
              
              {Object.entries(results.percentages).map(([style, percentage]) => (
                <div key={style} className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-700">{style}</span>
                    <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        style === 'Visual' ? 'bg-blue-500' :
                        style === 'Auditory' ? 'bg-green-500' :
                        style === 'Kinesthetic' ? 'bg-orange-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-2">What This Means for You:</h4>
              <p className="text-gray-700 leading-relaxed">{results.explanation}</p>
              <button 
                onClick={() => textToSpeech(results.explanation)}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm flex items-center"
              >
                🔊 Listen to explanation
              </button>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-green-800 font-medium text-center">
                🎯 I'll now adapt my teaching style to help you learn better!
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleNext}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Continue to Career Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step 2 of 4</span>
            <button onClick={handleSkip} className="text-sm text-gray-500 hover:text-gray-700">
              Skip for now
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full w-2/4"></div>
          </div>
        </div>

        {/* Question Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-sm text-indigo-600 font-medium">Learning Style Detection</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-indigo-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 group"
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full mr-3 group-hover:border-indigo-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900">{option.text}</span>
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
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Previous Question
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingLearningStyle;