import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ChevronRight, ChevronLeft, Clock, BookOpen, Users, Target, Play, CheckCircle } from 'lucide-react';

const CBTPracticePage = () => {
  const { isDarkMode } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [testConfig, setTestConfig] = useState({
    subject: '',
    examType: '',
    duration: 60,
    questionCount: 40,
    difficulty: 'mixed'
  });
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600);

  // Timer effect
  React.useEffect(() => {
    if (isTestStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Auto-submit when time runs out
            alert('Time is up! Test will be submitted automatically.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isTestStarted, timeLeft]);
  const [isLoading, setIsLoading] = useState(false);

  const subjectsByExam = {
    'jamb': [
      { id: 'mathematics', name: 'Mathematics', icon: '📊' },
      { id: 'english', name: 'English Language', icon: '📝' },
      { id: 'physics', name: 'Physics', icon: '⚛️' },
      { id: 'chemistry', name: 'Chemistry', icon: '🧪' },
      { id: 'biology', name: 'Biology', icon: '🧬' },
      { id: 'economics', name: 'Economics', icon: '💰' },
      { id: 'government', name: 'Government', icon: '🏛️' },
      { id: 'literature', name: 'Literature', icon: '📚' }
    ],
    'waec': [
      { id: 'mathematics', name: 'Mathematics', icon: '📊' },
      { id: 'english', name: 'English Language', icon: '📝' },
      { id: 'physics', name: 'Physics', icon: '⚛️' },
      { id: 'chemistry', name: 'Chemistry', icon: '🧪' },
      { id: 'biology', name: 'Biology', icon: '🧬' },
      { id: 'economics', name: 'Economics', icon: '💰' },
      { id: 'geography', name: 'Geography', icon: '🌍' },
      { id: 'history', name: 'History', icon: '📜' }
    ],
    'neco': [
      { id: 'mathematics', name: 'Mathematics', icon: '📊' },
      { id: 'english', name: 'English Language', icon: '📝' },
      { id: 'physics', name: 'Physics', icon: '⚛️' },
      { id: 'chemistry', name: 'Chemistry', icon: '🧪' },
      { id: 'biology', name: 'Biology', icon: '🧬' },
      { id: 'economics', name: 'Economics', icon: '💰' }
    ],
    'bece': [
      { id: 'mathematics', name: 'Mathematics', icon: '📊' },
      { id: 'english', name: 'English Language', icon: '📝' },
      { id: 'basic-science', name: 'Basic Science', icon: '🔬' },
      { id: 'social-studies', name: 'Social Studies', icon: '🌍' },
      { id: 'civic-education', name: 'Civic Education', icon: '🏛️' },
      { id: 'business-studies', name: 'Business Studies', icon: '💼' }
    ],
    'common-entrance': [
      { id: 'mathematics', name: 'Mathematics', icon: '📊' },
      { id: 'english', name: 'English Language', icon: '📝' },
      { id: 'verbal-reasoning', name: 'Verbal Reasoning', icon: '🧠' },
      { id: 'quantitative-reasoning', name: 'Quantitative Reasoning', icon: '🔢' }
    ],
    'ncee': [
      { id: 'mathematics', name: 'Mathematics', icon: '📊' },
      { id: 'english', name: 'English Language', icon: '📝' },
      { id: 'verbal-reasoning', name: 'Verbal Reasoning', icon: '🧠' },
      { id: 'quantitative-reasoning', name: 'Quantitative Reasoning', icon: '🔢' }
    ],
    'post-utme': [
      { id: 'mathematics', name: 'Mathematics', icon: '📊' },
      { id: 'english', name: 'English Language', icon: '📝' },
      { id: 'physics', name: 'Physics', icon: '⚛️' },
      { id: 'chemistry', name: 'Chemistry', icon: '🧪' },
      { id: 'biology', name: 'Biology', icon: '🧬' }
    ],
    'nabteb': [
      { id: 'mathematics', name: 'Mathematics', icon: '📊' },
      { id: 'english', name: 'English Language', icon: '📝' },
      { id: 'physics', name: 'Physics', icon: '⚛️' },
      { id: 'chemistry', name: 'Chemistry', icon: '🧪' },
      { id: 'technical-drawing', name: 'Technical Drawing', icon: '📐' }
    ],
    'gce': [
      { id: 'mathematics', name: 'Mathematics', icon: '📊' },
      { id: 'english', name: 'English Language', icon: '📝' },
      { id: 'physics', name: 'Physics', icon: '⚛️' },
      { id: 'chemistry', name: 'Chemistry', icon: '🧪' },
      { id: 'biology', name: 'Biology', icon: '🧬' }
    ]
  };

  const getSubjectsForExam = (examType) => {
    return subjectsByExam[examType] || [];
  };

  const examTypes = [
    { id: 'jamb', name: 'JAMB UTME', description: 'University entrance exam' },
    { id: 'waec', name: 'WAEC SSCE', description: 'Senior school certificate' },
    { id: 'neco', name: 'NECO SSCE', description: 'National examination' },
    { id: 'post-utme', name: 'Post-UTME', description: 'University screening' },
    { id: 'bece', name: 'BECE', description: 'Basic education certificate' },
    { id: 'ncee', name: 'NCEE', description: 'National common entrance' },
    { id: 'common-entrance', name: 'Common Entrance', description: 'Secondary school entrance' },
    { id: 'nabteb', name: 'NABTEB', description: 'Technical education board' },
    { id: 'gce', name: 'GCE O/L', description: 'General certificate exam' }
  ];

  const generateSampleQuestions = (count) => {
    const questions = [];
    for (let i = 1; i <= count; i++) {
      questions.push({
        id: i,
        question: `Sample ${testConfig.subject} question ${i} for ${testConfig.examType}?`,
        options: [`Option A for Q${i}`, `Option B for Q${i}`, `Option C for Q${i}`, `Option D for Q${i}`],
        correct: Math.floor(Math.random() * 4)
      });
    }
    return questions;
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const startTest = async () => {
    setIsLoading(true);
    try {
      const examData = examTypes.find(e => e.id === testConfig.examType);
      const subjectData = getSubjectsForExam(testConfig.examType).find(s => s.id === testConfig.subject);
      
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
              content: `Generate ${testConfig.questionCount} ${testConfig.difficulty} level multiple choice questions for ${examData.name} ${subjectData.name}. Each question should have 4 options (A, B, C, D) with only one correct answer. Use Nigerian curriculum context.
              
              Format as JSON array: [
                {
                  "id": 1,
                  "question": "Question text",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "correct": 0
                }
              ]
              
              Make questions realistic for ${examData.description} level.`
            },
            { role: 'user', content: `Generate questions for ${subjectData.name}` }
          ],
          temperature: 0.8,
          max_tokens: 4000
        })
      });

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      try {
        const jsonMatch = aiResponse.match(/\[.*\]/s);
        if (jsonMatch) {
          const generatedQuestions = JSON.parse(jsonMatch[0]);
          setQuestions(generatedQuestions.slice(0, testConfig.questionCount));
        } else {
          setQuestions(generateSampleQuestions(testConfig.questionCount));
        }
      } catch (parseError) {
        console.error('Error parsing AI questions:', parseError);
        setQuestions(generateSampleQuestions(testConfig.questionCount));
      }
      
      setIsTestStarted(true);
      setTimeLeft(testConfig.duration * 60);
      
    } catch (error) {
      console.error('Error generating questions:', error);
      setQuestions(generateSampleQuestions(testConfig.questionCount));
      setIsTestStarted(true);
      setTimeLeft(testConfig.duration * 60);
    }
    setIsLoading(false);
  };

  const selectAnswer = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isTestStarted) {
    const question = questions[currentQuestion];
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Test Header */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b sticky top-0 z-10`}>
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Question {currentQuestion + 1} of {questions.length}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {testConfig.subject} • {testConfig.examType}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-orange-600">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
                </div>
                <button className="px-4 py-2 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 text-sm">
                  Submit Test
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Question Panel */}
            <div className="lg:col-span-3">
              <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
                <div className="mb-6">
                  <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>
                    {question.question}
                  </h2>
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => selectAnswer(question.id, index)}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          answers[question.id] === index
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : isDarkMode 
                              ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-300'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            answers[question.id] === index
                              ? 'border-blue-500 bg-blue-500'
                              : isDarkMode ? 'border-gray-500' : 'border-gray-300'
                          }`}>
                            {answers[question.id] === index && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className={`flex flex-col sm:flex-row sm:justify-between gap-4 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <button
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                    className={`flex items-center justify-center space-x-2 px-6 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDarkMode 
                        ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  <button
                    onClick={nextQuestion}
                    disabled={currentQuestion === questions.length - 1}
                    className="flex items-center justify-center space-x-2 px-6 py-2 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white rounded-lg hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Question Navigator */}
            <div className="lg:col-span-1">
              <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-4 sticky top-24`}>
                <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Questions</h3>
                <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                        index === currentQuestion
                          ? 'bg-blue-600 text-white'
                          : answers[questions[index].id] !== undefined
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : isDarkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <div className={`mt-4 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
                    <span>Not answered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>CBT Practice Test</h1>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Set up your practice test</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-16 sm:w-24 h-1 mx-2 ${
                  step < currentStep ? 'bg-blue-600' : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className={`flex justify-between mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span>Exam Type</span>
          <span>Subject</span>
          <span>Settings</span>
          <span>Review</span>
        </div>
      </div>

      {/* Step Content */}
      <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6`}>
        {currentStep === 1 && (
          <div>
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Select Exam Type</h2>
            <div className="space-y-3">
              {examTypes.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => setTestConfig({...testConfig, examType: exam.id, subject: ''})}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                    testConfig.examType === exam.id
                      ? 'border-blue-500 bg-blue-50'
                      : isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{exam.name}</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{exam.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Select Subject</h2>
            {testConfig.examType ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {getSubjectsForExam(testConfig.examType).map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => setTestConfig({...testConfig, subject: subject.id})}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      testConfig.subject === subject.id
                        ? 'border-blue-500 bg-blue-50'
                        : isDarkMode 
                          ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{subject.icon}</div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{subject.name}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Please select an exam type first
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Test Settings</h2>
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Duration (minutes)
                </label>
                <select
                  value={testConfig.duration}
                  onChange={(e) => setTestConfig({...testConfig, duration: parseInt(e.target.value)})}
                  className={`w-full border rounded-lg px-3 py-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Number of Questions
                </label>
                <select
                  value={testConfig.questionCount}
                  onChange={(e) => setTestConfig({...testConfig, questionCount: parseInt(e.target.value)})}
                  className={`w-full border rounded-lg px-3 py-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                >
                  <option value={20}>20 questions</option>
                  <option value={40}>40 questions</option>
                  <option value={60}>60 questions</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Difficulty Level
                </label>
                <select
                  value={testConfig.difficulty}
                  onChange={(e) => setTestConfig({...testConfig, difficulty: e.target.value})}
                  className={`w-full border rounded-lg px-3 py-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Review & Start</h2>
            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 mb-6`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Subject</div>
                    <div className={`text-sm capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{testConfig.subject}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-green-600" />
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Exam Type</div>
                    <div className={`text-sm uppercase ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{testConfig.examType}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Duration</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{testConfig.duration} minutes</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Questions</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{testConfig.questionCount} questions</div>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={startTest}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-br from-gray-800 via-blue-800 to-indigo-800 text-white rounded-lg hover:from-gray-700 hover:via-blue-700 hover:to-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5" />
              <span>{isLoading ? 'AI Generating Questions...' : 'Start Test'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-6">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`flex items-center justify-center space-x-2 px-6 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
            isDarkMode 
              ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep === 4 || (currentStep === 1 && !testConfig.examType) || (currentStep === 2 && !testConfig.subject)}
          className="flex items-center justify-center space-x-2 px-6 py-2 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white rounded-lg hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CBTPracticePage;