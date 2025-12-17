import React, { useState } from 'react';
import { Brain, Eye, Ear, Hand, BookOpen } from 'lucide-react';

const LearningStyleDetection = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const questions = [
    {
      question: "When learning a new math concept, you prefer to:",
      options: [
        { text: "See diagrams, charts, and visual examples", style: "visual" },
        { text: "Listen to the teacher explain step-by-step", style: "auditory" },
        { text: "Work through practice problems immediately", style: "kinesthetic" },
        { text: "Read detailed notes and definitions", style: "reading" }
      ]
    },
    {
      question: "To remember JAMB Chemistry formulas, you would:",
      options: [
        { text: "Create colorful mind maps and flowcharts", style: "visual" },
        { text: "Repeat them aloud or create songs/rhymes", style: "auditory" },
        { text: "Write them multiple times while walking", style: "kinesthetic" },
        { text: "Make organized lists and flashcards", style: "reading" }
      ]
    },
    {
      question: "During group study sessions, you learn best when:",
      options: [
        { text: "Drawing concepts on the whiteboard", style: "visual" },
        { text: "Discussing and explaining to others", style: "auditory" },
        { text: "Acting out scenarios or doing experiments", style: "kinesthetic" },
        { text: "Taking detailed notes from discussions", style: "reading" }
      ]
    },
    {
      question: "When preparing for WAEC Physics, you prefer:",
      options: [
        { text: "Watching video demonstrations and animations", style: "visual" },
        { text: "Listening to physics podcasts or lectures", style: "auditory" },
        { text: "Building models or doing lab experiments", style: "kinesthetic" },
        { text: "Reading textbooks and solving written problems", style: "reading" }
      ]
    },
    {
      question: "You best understand English Literature when you:",
      options: [
        { text: "Visualize scenes and characters in your mind", style: "visual" },
        { text: "Read passages aloud or listen to audio books", style: "auditory" },
        { text: "Act out scenes or relate to personal experiences", style: "kinesthetic" },
        { text: "Analyze themes through written essays", style: "reading" }
      ]
    }
  ];

  const learningStyles = {
    visual: {
      name: "Visual Learner",
      icon: <Eye className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      description: "You learn best through images, diagrams, and visual representations."
    },
    auditory: {
      name: "Auditory Learner", 
      icon: <Ear className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
      description: "You learn best through listening and speaking."
    },
    kinesthetic: {
      name: "Kinesthetic Learner",
      icon: <Hand className="w-8 h-8" />,
      color: "from-orange-500 to-red-500", 
      description: "You learn best through hands-on activities and movement."
    },
    reading: {
      name: "Reading/Writing Learner",
      icon: <BookOpen className="w-8 h-8" />,
      color: "from-gray-900 via-blue-900 to-indigo-900",
      description: "You learn best through reading and writing."
    }
  };

  const handleAnswer = (selectedOption) => {
    const newAnswers = [...answers, selectedOption.style];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (allAnswers) => {
    const counts = { visual: 0, auditory: 0, kinesthetic: 0, reading: 0 };
    allAnswers.forEach(answer => counts[answer]++);
    
    const total = allAnswers.length;
    const percentages = {};
    Object.keys(counts).forEach(style => {
      percentages[style] = Math.round((counts[style] / total) * 100);
    });

    const dominant = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    
    const result = { dominant, percentages, counts };
    setResults(result);
    localStorage.setItem('learningStyle', JSON.stringify(result));
    setShowResults(true);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults && results) {
    const dominantStyle = learningStyles[results.dominant];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6 animate-bounce">
              <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${dominantStyle.color} flex items-center justify-center text-white mb-4`}>
                {dominantStyle.icon}
              </div>
              <div className="text-6xl mb-2">🎉</div>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              You're a {dominantStyle.name}!
            </h1>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              {dominantStyle.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {Object.entries(results.percentages).map(([style, percentage]) => (
                <div key={style} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${learningStyles[style].color} flex items-center justify-center text-white text-sm`}>
                      {learningStyles[style].icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{percentage}%</div>
                  <div className="text-sm text-gray-600">{learningStyles[style].name.split(' ')[0]}</div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${learningStyles[style].color}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onComplete && onComplete(results)}
              className="w-full py-4 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Learning with Your Style 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-full flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Discover Your Learning Style
            </h1>
            <p className="text-gray-600">
              Answer 5 quick questions to personalize your study experience
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full p-4 text-left rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-indigo-500 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-gray-700 group-hover:text-indigo-700 font-medium">
                      {option.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>This assessment takes about 2 minutes to complete</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningStyleDetection;