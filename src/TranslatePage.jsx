import React, { useState, useEffect } from "react";

export default function CBTTestingPlatform() {
  const [currentScreen, setCurrentScreen] = useState("setup"); // setup, test, results
  const [apiKey, setApiKey] = useState("");
  const [showSetup, setShowSetup] = useState(true);
  const [testConfig, setTestConfig] = useState({
    subject: "",
    questionCount: 20,
    difficulty: "intermediate",
    examType: "JAMB",
    selectedTopics: [],
    customTime: 30, // minutes
    useCustomTime: false
  });
  
  // Test state
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  
  // Results state
  const [testResults, setTestResults] = useState(null);

  const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
  const MODEL = "llama-3.3-70b-versatile";

  // Nigerian Educational Standards
  const examTypes = {
    "WAEC": "West African Examinations Council (Senior Secondary)",
    "JAMB": "Joint Admissions and Matriculation Board (University Entry)",
    "100Level": "University First Year Level"
  };

  // Subject topics mapping for Nigerian curriculum
  const subjectTopics = {
    "Mathematics": {
      "WAEC": [
        "Number and Numeration", "Algebraic Processes", "Geometry and Trigonometry", 
        "Statistics", "Calculus", "Sets and Logic", "Coordinate Geometry", "Vectors"
      ],
      "JAMB": [
        "Number and Numeration", "Algebra", "Geometry/Trigonometry", 
        "Calculus", "Statistics", "Probability"
      ],
      "100Level": [
        "Calculus I", "Linear Algebra", "Set Theory", "Mathematical Logic", 
        "Coordinate Geometry", "Trigonometry", "Statistics and Probability"
      ]
    },
    "Physics": {
      "WAEC": [
        "Mechanics", "Heat and Thermodynamics", "Waves and Optics", 
        "Electricity and Magnetism", "Modern Physics", "Simple Harmonic Motion"
      ],
      "JAMB": [
        "Mechanics", "Heat", "Light/Optics", "Sound", "Electricity", 
        "Magnetism", "Modern Physics"
      ],
      "100Level": [
        "Classical Mechanics", "Thermodynamics", "Wave Physics", 
        "Electromagnetic Theory", "Quantum Physics Introduction", "Laboratory Techniques"
      ]
    },
    "Chemistry": {
      "WAEC": [
        "Atomic Structure", "Chemical Bonding", "Acids and Bases", 
        "Oxidation and Reduction", "Organic Chemistry", "Chemical Equilibrium", 
        "Electrochemistry", "Thermochemistry"
      ],
      "JAMB": [
        "Atomic Structure", "Bonding", "Air/Water/Soil", "Metals and Non-metals", 
        "Acids/Bases/Salts", "Oxidation/Reduction", "Hydrocarbons", "Organic Compounds"
      ],
      "100Level": [
        "General Chemistry I", "Atomic Theory", "Chemical Bonding", 
        "Stoichiometry", "Thermodynamics", "Chemical Kinetics", "Organic Chemistry Basics"
      ]
    },
    "Biology": {
      "WAEC": [
        "Cell Biology", "Genetics", "Evolution", "Ecology", 
        "Plant Biology", "Animal Biology", "Human Biology", "Microbiology"
      ],
      "JAMB": [
        "Cell Biology", "Genetics", "Evolution", "Ecology", 
        "Diversity of Living Things", "Plant/Animal Nutrition", "Reproduction"
      ],
      "100Level": [
        "General Biology I", "Cell Biology", "Genetics", "Evolution", 
        "Plant Biology", "Animal Biology", "Ecology", "Microbiology"
      ]
    },
    "English Language": {
      "WAEC": [
        "Comprehension", "Lexis and Structure", "Oral English", 
        "Essay Writing", "Letter Writing", "Summary", "Literature"
      ],
      "JAMB": [
        "Comprehension", "Lexis and Structure", "Oral Forms", 
        "Written Forms", "Summary/Comprehension"
      ],
      "100Level": [
        "Academic Writing", "Grammar and Usage", "Reading Comprehension", 
        "Communication Skills", "Literature Appreciation", "Research Methods"
      ]
    },
    "Economics": {
      "WAEC": [
        "Basic Economic Concepts", "Theory of Consumer Behavior", "Theory of Production", 
        "Market Structure", "National Income", "Money and Banking", "International Trade", "Development Economics"
      ],
      "JAMB": [
        "Basic Economic Problems", "Production", "Distribution", "Consumption", 
        "Population", "National Income", "Money/Banking/Finance", "Government and Economy"
      ],
      "100Level": [
        "Principles of Economics I", "Microeconomics", "Macroeconomics", 
        "Economic Systems", "Market Economics", "Development Economics"
      ]
    },
    "Government": {
      "WAEC": [
        "Political Theory", "Constitutional Development", "Federalism", 
        "Electoral Systems", "Political Parties", "Public Administration", "International Relations"
      ],
      "JAMB": [
        "Political Theory", "Government Systems", "Constitutional Development", 
        "Federalism", "Electoral Process", "Political Parties", "International Organizations"
      ],
      "100Level": [
        "Introduction to Political Science", "Comparative Government", "Constitutional Law", 
        "Public Administration", "International Relations", "Political Theory"
      ]
    },
    "Geography": {
      "WAEC": [
        "Physical Geography", "Human Geography", "Practical Geography", 
        "Regional Geography", "Economic Geography", "Environmental Geography"
      ],
      "JAMB": [
        "Physical Environment", "Human Environment", "Environmental Resources", 
        "Agriculture", "Industries", "Settlement/Transportation"
      ],
      "100Level": [
        "Physical Geography", "Human Geography", "Cartography", 
        "Geographic Information Systems", "Environmental Geography", "Regional Analysis"
      ]
    }
  };

  // Timer effect
  useEffect(() => {
    if (testStarted && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && testStarted) {
      finishTest();
    }
  }, [timeRemaining, testStarted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDefaultTime = () => {
    const times = {
      "WAEC": testConfig.questionCount * 2, // 2 minutes per question
      "JAMB": testConfig.questionCount * 1.5, // 1.5 minutes per question (JAMB is timed strictly)
      "100Level": testConfig.questionCount * 2.5 // 2.5 minutes per question (more analytical)
    };
    return Math.round(times[testConfig.examType] || testConfig.questionCount * 2);
  };

  const handleTopicToggle = (topic) => {
    const newTopics = testConfig.selectedTopics.includes(topic)
      ? testConfig.selectedTopics.filter(t => t !== topic)
      : [...testConfig.selectedTopics, topic];
    
    setTestConfig({...testConfig, selectedTopics: newTopics});
  };

  const selectAllTopics = () => {
    const allTopics = subjectTopics[testConfig.subject]?.[testConfig.examType] || [];
    setTestConfig({...testConfig, selectedTopics: allTopics});
  };

  const clearAllTopics = () => {
    setTestConfig({...testConfig, selectedTopics: []});
  };

  const generateQuestions = async () => {
    if (!apiKey || !testConfig.subject || testConfig.selectedTopics.length === 0) return;
    
    setLoading(true);
    try {
      const topicsText = testConfig.selectedTopics.join(", ");
      const examStandard = examTypes[testConfig.examType];
      
      let prompt = `Generate exactly ${testConfig.questionCount} multiple choice questions for ${testConfig.subject} suitable for ${examStandard} standard.

Focus specifically on these topics: ${topicsText}

Requirements for ${testConfig.examType} questions:`;

      if (testConfig.examType === "WAEC") {
        prompt += `
- Follow WAEC Senior Secondary Certificate format
- Include practical application questions
- Mix of knowledge, comprehension, and application levels
- Nigerian context where applicable`;
      } else if (testConfig.examType === "JAMB") {
        prompt += `
- Follow JAMB UTME format and difficulty
- Quick-answer format suitable for computer-based test
- Mix theoretical and practical questions
- Nigerian educational curriculum standard`;
      } else if (testConfig.examType === "100Level") {
        prompt += `
- University first-year level complexity
- More analytical and critical thinking questions
- Foundation concepts for advanced study
- Academic depth appropriate for undergraduate level`;
      }

      prompt += `

Format each question as JSON with this exact structure:
{
  "question": "Question text here?",
  "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
  "correct_answer": "A",
  "explanation": "Brief explanation of why this is correct",
  "topic": "Topic name from the list provided"
}

Return only a JSON array of questions. Ensure questions are varied across the selected topics and follow ${testConfig.examType} standards.`;

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const questionsText = data.choices[0]?.message?.content;
      
      try {
        const questionsArray = JSON.parse(questionsText);
        if (Array.isArray(questionsArray) && questionsArray.length > 0) {
          setQuestions(questionsArray);
          setUserAnswers(new Array(questionsArray.length).fill(null));
          
          // Set time based on user preference or default
          const timeInSeconds = testConfig.useCustomTime 
            ? testConfig.customTime * 60 
            : getDefaultTime() * 60;
          
          setTimeRemaining(timeInSeconds);
          setCurrentScreen("test");
          setTestStarted(true);
        } else {
          throw new Error("Invalid questions format");
        }
      } catch (parseError) {
        throw new Error("Failed to parse questions. Please try again.");
      }

    } catch (error) {
      alert(`Error generating questions: ${error.message}`);
    }
    setLoading(false);
  };

  const handleAnswerSelect = (answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const saveQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!savedQuestions.find(q => q.question === currentQuestion.question)) {
      setSavedQuestions([...savedQuestions, { ...currentQuestion, savedAt: new Date() }]);
      alert("Question saved successfully!");
    } else {
      alert("Question already saved!");
    }
  };

  const finishTest = () => {
    setTestStarted(false);
    
    let correctCount = 0;
    const detailedResults = questions.map((q, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === q.correct_answer;
      if (isCorrect) correctCount++;
      
      return {
        question: q.question,
        userAnswer,
        correctAnswer: q.correct_answer,
        isCorrect,
        explanation: q.explanation,
        options: q.options,
        topic: q.topic || "General"
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);
    let grade = "F";
    if (score >= 90) grade = "A";
    else if (score >= 80) grade = "B";
    else if (score >= 70) grade = "C";
    else if (score >= 60) grade = "D";

    setTestResults({
      score,
      grade,
      correctCount,
      totalQuestions: questions.length,
      details: detailedResults,
      subject: testConfig.subject,
      examType: testConfig.examType,
      topics: testConfig.selectedTopics,
      completedAt: new Date()
    });
    
    setCurrentScreen("results");
  };

  const resetTest = () => {
    setCurrentScreen("setup");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTestResults(null);
    setTestStarted(false);
    setTimeRemaining(0);
  };

  // Setup Screen
  if (showSetup || !apiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎓</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              EduBridge CBT Platform
            </h1>
            <p className="text-gray-600">WAEC • JAMB • 100Level Standards</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <span>🇳🇬</span> Nigerian Educational Standards
            </h2>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• <strong>WAEC:</strong> Senior Secondary Certificate standard</li>
              <li>• <strong>JAMB:</strong> University entrance examination format</li>
              <li>• <strong>100Level:</strong> University first-year level questions</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span>🔑</span> Setup Your API Key
            </h2>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
              <li>Visit <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-blue-600">console.groq.com</a></li>
              <li>Create a free account and get your API key</li>
              <li>Paste it below to start creating tests</li>
            </ol>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Groq API Key
              </label>
              <input
                type="password"
                placeholder="gsk_..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => apiKey.trim() && setShowSetup(false)}
              disabled={!apiKey.trim()}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
            >
              Continue to Test Setup →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Test Configuration Screen
  if (currentScreen === "setup") {
    const availableTopics = subjectTopics[testConfig.subject]?.[testConfig.examType] || [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Configure Your Test
              </h1>
              <p className="text-gray-600">Nigerian Educational Standards • Topic-Specific Testing</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Basic Configuration */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Settings</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Examination Type
                  </label>
                  <div className="space-y-2">
                    {Object.entries(examTypes).map(([key, description]) => (
                      <label key={key} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="examType"
                          value={key}
                          checked={testConfig.examType === key}
                          onChange={(e) => setTestConfig({...testConfig, examType: e.target.value, selectedTopics: []})}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-gray-800">{key}</div>
                          <div className="text-xs text-gray-600">{description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Subject
                  </label>
                  <select
                    value={testConfig.subject}
                    onChange={(e) => setTestConfig({...testConfig, subject: e.target.value, selectedTopics: []})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Choose a subject...</option>
                    {Object.keys(subjectTopics).map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Number of Questions: {testConfig.questionCount}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={testConfig.questionCount}
                    onChange={(e) => setTestConfig({...testConfig, questionCount: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>10 questions</span>
                    <span>60 questions</span>
                  </div>
                </div>
              </div>

              {/* Topics Selection */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-lg font-semibold text-gray-800">Select Topics</h3>
                  {availableTopics.length > 0 && (
                    <div className="flex gap-2">
                      <button
                        onClick={selectAllTopics}
                        className="text-xs px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition"
                      >
                        Select All
                      </button>
                      <button
                        onClick={clearAllTopics}
                        className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                </div>

                {!testConfig.subject ? (
                  <p className="text-gray-500 text-center py-8">Please select a subject first</p>
                ) : availableTopics.length === 0 ? (
                  <p className="text-red-500 text-center py-8">No topics available for this combination</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availableTopics.map((topic) => (
                      <label key={topic} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={testConfig.selectedTopics.includes(topic)}
                          onChange={() => handleTopicToggle(topic)}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">{topic}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                {testConfig.selectedTopics.length > 0 && (
                  <div className="bg-indigo-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-indigo-800 mb-2">
                      Selected Topics ({testConfig.selectedTopics.length}):
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {testConfig.selectedTopics.map((topic, index) => (
                        <span key={index} className="text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Time Settings & Summary */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Time Settings</h3>
                
                <div>
                  <label className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      checked={testConfig.useCustomTime}
                      onChange={(e) => setTestConfig({...testConfig, useCustomTime: e.target.checked})}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Use custom time</span>
                  </label>

                  {testConfig.useCustomTime ? (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Test Duration: {testConfig.customTime} minutes
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="180"
                        value={testConfig.customTime}
                        onChange={(e) => setTestConfig({...testConfig, customTime: parseInt(e.target.value)})}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>10 min</span>
                        <span>180 min</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">
                        <strong>Default Time:</strong> {getDefaultTime()} minutes
                        <br />
                        <span className="text-xs">Based on {testConfig.examType} standards</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Test Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Exam Type:</span>
                      <span className="font-medium">{testConfig.examType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subject:</span>
                      <span className="font-medium">{testConfig.subject || "Not selected"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Topics:</span>
                      <span className="font-medium">{testConfig.selectedTopics.length} selected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Questions:</span>
                      <span className="font-medium">{testConfig.questionCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">
                        {testConfig.useCustomTime ? testConfig.customTime : getDefaultTime()} minutes
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={generateQuestions}
                    disabled={!testConfig.subject || testConfig.selectedTopics.length === 0 || loading}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
                  >
                    {loading ? "🔄 Generating Questions..." : "🚀 Start Test"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Test Screen
  if (currentScreen === "test") {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const answeredCount = userAnswers.filter(answer => answer !== null).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{testConfig.examType} • {testConfig.subject}</h1>
                <p className="text-gray-600">Question {currentQuestionIndex + 1} of {questions.length} • {answeredCount} answered</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-indigo-600">
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-sm text-gray-500">Time Remaining</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{width: `${progress}%`}}
                ></div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
                    {currentQuestion?.topic || "General"}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                    {testConfig.examType}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {currentQuestion?.question}
                </h2>
              </div>
              <button
                onClick={saveQuestion}
                className="ml-4 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition flex items-center gap-2 text-sm font-medium"
              >
                <span>💾</span> Save Question
              </button>
            </div>

            <div className="space-y-3">
              {currentQuestion?.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option[0])} // A, B, C, D
                  className={`w-full p-4 text-left rounded-lg border-2 transition ${
                    userAnswers[currentQuestionIndex] === option[0]
                      ? "border-indigo-500 bg-indigo-50 text-indigo-800"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <span className="font-medium">{option}</span>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
              >
                ← Previous
              </button>

              <div className="flex gap-2 max-w-md overflow-x-auto">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition ${
                      userAnswers[index] 
                        ? "bg-green-500 text-white" 
                        : index === currentQuestionIndex
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={finishTest}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition"
                >
                  Submit Test
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
                >
                  Next →
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {testConfig.examType} • {testConfig.selectedTopics.length} topics
              </span>
              <span className="text-gray-600">
                Progress: {answeredCount}/{questions.length} ({Math.round((answeredCount/questions.length)*100)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (currentScreen === "results" && testResults) {
    // Topic-wise analysis
    const topicAnalysis = {};
    testResults.details.forEach(result => {
      const topic = result.topic || "General";
      if (!topicAnalysis[topic]) {
        topicAnalysis[topic] = { correct: 0, total: 0 };
      }
      topicAnalysis[topic].total++;
      if (result.isCorrect) topicAnalysis[topic].correct++;
    });

    const getGradeColor = (grade) => {
      const colors = {
        "A": "from-green-500 to-emerald-600",
        "B": "from-blue-500 to-cyan-600",
        "C": "from-yellow-500 to-orange-600",
        "D": "from-orange-500 to-red-600",
        "F": "from-red-500 to-red-700"
      };
      return colors[grade] || colors["F"];
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Results Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {testResults.grade === "A" ? "🏆" : testResults.grade === "B" ? "🥈" : testResults.grade === "C" ? "🥉" : testResults.grade === "D" ? "📚" : "💪"}
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Test Complete!</h1>
              <p className="text-gray-600 mb-2">{testConfig.examType} • {testConfig.subject}</p>
              <p className="text-sm text-gray-500 mb-6">{testResults.topics.join(", ")}</p>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg p-4">
                  <div className="text-3xl font-bold">{testResults.score}%</div>
                  <div className="text-sm opacity-90">Final Score</div>
                </div>
                <div className={`bg-gradient-to-br ${getGradeColor(testResults.grade)} text-white rounded-lg p-4`}>
                  <div className="text-3xl font-bold">{testResults.grade}</div>
                  <div className="text-sm opacity-90">Grade</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg p-4">
                  <div className="text-3xl font-bold">{testResults.correctCount}</div>
                  <div className="text-sm opacity-90">Correct</div>
                </div>
                <div className="bg-gradient-to-br from-gray-500 to-slate-600 text-white rounded-lg p-4">
                  <div className="text-3xl font-bold">{testResults.totalQuestions - testResults.correctCount}</div>
                  <div className="text-sm opacity-90">Incorrect</div>
                </div>
              </div>
            </div>
          </div>

          {/* Topic Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance by Topic</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(topicAnalysis).map(([topic, stats]) => {
                const percentage = Math.round((stats.correct / stats.total) * 100);
                return (
                  <div key={topic} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm">{topic}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
                      <span className="text-sm text-gray-600">{stats.correct}/{stats.total}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{width: `${percentage}%`}}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Question Review</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {testResults.details.map((result, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    result.isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-800">Q{index + 1}:</span>
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                        {result.topic}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      result.isCorrect ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                    }`}>
                      {result.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{result.question}</p>
                  <div className="text-sm space-y-1">
                    <p><strong>Your answer:</strong> {result.userAnswer || "Not answered"}</p>
                    <p><strong>Correct answer:</strong> {result.correctAnswer}</p>
                    {result.explanation && (
                      <p className="text-gray-600 italic mt-2">{result.explanation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Questions */}
          {savedQuestions.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Saved Questions ({savedQuestions.length})</h2>
              <div className="space-y-3">
                {savedQuestions.map((q, index) => (
                  <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">
                        {q.topic || "General"}
                      </span>
                      <span className="text-xs text-gray-500">
                        Saved {q.savedAt?.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="font-medium mb-2">{q.question}</p>
                    <p className="text-sm text-gray-600">Correct Answer: {q.correct_answer}</p>
                    {q.explanation && (
                      <p className="text-sm text-gray-600 italic mt-1">{q.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Recommendations */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📈 Performance Insights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Strengths</h3>
                <ul className="space-y-1 text-sm">
                  {Object.entries(topicAnalysis)
                    .filter(([_, stats]) => (stats.correct / stats.total) >= 0.7)
                    .map(([topic, stats]) => (
                      <li key={topic} className="text-green-700 flex items-center gap-2">
                        <span>✅</span> {topic} ({Math.round((stats.correct / stats.total) * 100)}%)
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Areas for Improvement</h3>
                <ul className="space-y-1 text-sm">
                  {Object.entries(topicAnalysis)
                    .filter(([_, stats]) => (stats.correct / stats.total) < 0.7)
                    .map(([topic, stats]) => (
                      <li key={topic} className="text-orange-700 flex items-center gap-2">
                        <span>📚</span> {topic} ({Math.round((stats.correct / stats.total) * 100)}%)
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Recommendation:</strong> 
                {testResults.score >= 80 
                  ? " Excellent performance! Focus on maintaining consistency across all topics."
                  : testResults.score >= 60 
                  ? " Good effort! Review weak topics and practice more questions in those areas."
                  : " More practice needed. Focus on understanding fundamental concepts in each topic."}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <button
              onClick={resetTest}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition shadow-lg"
            >
              Take Another Test
            </button>
            <button
              onClick={() => setShowSetup(true)}
              className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition shadow-lg"
            >
              Change API Key
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
































// import React, { useState, useEffect } from "react";

// export default function CBTTestingPlatform() {
//   const [currentScreen, setCurrentScreen] = useState("setup"); // setup, test, results
//   const [apiKey, setApiKey] = useState("");
//   const [showSetup, setShowSetup] = useState(true);
//   const [testConfig, setTestConfig] = useState({
//     subject: "",
//     questionCount: 20,
//     difficulty: "intermediate"
//   });
  
//   // Test state
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [userAnswers, setUserAnswers] = useState([]);
//   const [savedQuestions, setSavedQuestions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [timeRemaining, setTimeRemaining] = useState(0);
//   const [testStarted, setTestStarted] = useState(false);
  
//   // Results state
//   const [testResults, setTestResults] = useState(null);

//   const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
//   const MODEL = "llama-3.3-70b-versatile";

//   const subjects = [
//     "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science",
//     "English Literature", "History", "Geography", "Economics", "Psychology"
//   ];

//   // Timer effect
//   useEffect(() => {
//     if (testStarted && timeRemaining > 0) {
//       const timer = setTimeout(() => {
//         setTimeRemaining(timeRemaining - 1);
//       }, 1000);
//       return () => clearTimeout(timer);
//     } else if (timeRemaining === 0 && testStarted) {
//       finishTest();
//     }
//   }, [timeRemaining, testStarted]);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const generateQuestions = async () => {
//     if (!apiKey || !testConfig.subject) return;
    
//     setLoading(true);
//     try {
//       const prompt = `Generate exactly ${testConfig.questionCount} multiple choice questions for ${testConfig.subject} at ${testConfig.difficulty} level. 
      
//       Format each question as JSON with this exact structure:
//       {
//         "question": "Question text here?",
//         "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
//         "correct_answer": "A",
//         "explanation": "Brief explanation of why this is correct"
//       }
      
//       Return only a JSON array of questions. Make sure questions are varied and test different concepts. Each question should have exactly 4 options labeled A, B, C, D.`;

//       const response = await fetch(GROQ_API_URL, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${apiKey}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: MODEL,
//           messages: [{ role: "user", content: prompt }],
//           temperature: 0.7,
//           max_tokens: 4000,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`API Error: ${response.status}`);
//       }

//       const data = await response.json();
//       const questionsText = data.choices[0]?.message?.content;
      
//       try {
//         const questionsArray = JSON.parse(questionsText);
//         if (Array.isArray(questionsArray) && questionsArray.length > 0) {
//           setQuestions(questionsArray);
//           setUserAnswers(new Array(questionsArray.length).fill(null));
//           setTimeRemaining(questionsArray.length * 90); // 1.5 minutes per question
//           setCurrentScreen("test");
//           setTestStarted(true);
//         } else {
//           throw new Error("Invalid questions format");
//         }
//       } catch (parseError) {
//         throw new Error("Failed to parse questions. Please try again.");
//       }

//     } catch (error) {
//       alert(`Error generating questions: ${error.message}`);
//     }
//     setLoading(false);
//   };

//   const handleAnswerSelect = (answer) => {
//     const newAnswers = [...userAnswers];
//     newAnswers[currentQuestionIndex] = answer;
//     setUserAnswers(newAnswers);
//   };

//   const nextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const previousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const saveQuestion = () => {
//     const currentQuestion = questions[currentQuestionIndex];
//     if (!savedQuestions.find(q => q.question === currentQuestion.question)) {
//       setSavedQuestions([...savedQuestions, { ...currentQuestion, savedAt: new Date() }]);
//       alert("Question saved successfully!");
//     } else {
//       alert("Question already saved!");
//     }
//   };

//   const finishTest = () => {
//     setTestStarted(false);
    
//     let correctCount = 0;
//     const detailedResults = questions.map((q, index) => {
//       const userAnswer = userAnswers[index];
//       const isCorrect = userAnswer === q.correct_answer;
//       if (isCorrect) correctCount++;
      
//       return {
//         question: q.question,
//         userAnswer,
//         correctAnswer: q.correct_answer,
//         isCorrect,
//         explanation: q.explanation,
//         options: q.options
//       };
//     });

//     const score = Math.round((correctCount / questions.length) * 100);
//     let grade = "F";
//     if (score >= 90) grade = "A";
//     else if (score >= 80) grade = "B";
//     else if (score >= 70) grade = "C";
//     else if (score >= 60) grade = "D";

//     setTestResults({
//       score,
//       grade,
//       correctCount,
//       totalQuestions: questions.length,
//       details: detailedResults,
//       subject: testConfig.subject,
//       completedAt: new Date()
//     });
    
//     setCurrentScreen("results");
//   };

//   const resetTest = () => {
//     setCurrentScreen("setup");
//     setQuestions([]);
//     setCurrentQuestionIndex(0);
//     setUserAnswers([]);
//     setTestResults(null);
//     setTestStarted(false);
//     setTimeRemaining(0);
//   };

//   // Setup Screen
//   if (showSetup || !apiKey) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
//           <div className="text-center mb-8">
//             <div className="text-6xl mb-4">🎓</div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
//               CBT Testing Platform
//             </h1>
//             <p className="text-gray-600">AI-Powered Computer Based Testing System</p>
//           </div>

//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
//             <h2 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
//               <span>🔑</span> Setup Your API Key
//             </h2>
//             <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
//               <li>Visit <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-blue-600">console.groq.com</a></li>
//               <li>Create a free account and get your API key</li>
//               <li>Paste it below to start creating tests</li>
//             </ol>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Groq API Key
//               </label>
//               <input
//                 type="password"
//                 placeholder="gsk_..."
//                 value={apiKey}
//                 onChange={(e) => setApiKey(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//             </div>

//             <button
//               onClick={() => apiKey.trim() && setShowSetup(false)}
//               disabled={!apiKey.trim()}
//               className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
//             >
//               Continue to Test Setup →
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Test Configuration Screen
//   if (currentScreen === "setup") {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
//                 Configure Your Test
//               </h1>
//               <p className="text-gray-600">Set up your personalized testing experience</p>
//             </div>

//             <div className="grid md:grid-cols-2 gap-8">
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-3">
//                     Select Subject
//                   </label>
//                   <select
//                     value={testConfig.subject}
//                     onChange={(e) => setTestConfig({...testConfig, subject: e.target.value})}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   >
//                     <option value="">Choose a subject...</option>
//                     {subjects.map(subject => (
//                       <option key={subject} value={subject}>{subject}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-3">
//                     Number of Questions: {testConfig.questionCount}
//                   </label>
//                   <input
//                     type="range"
//                     min="10"
//                     max="60"
//                     value={testConfig.questionCount}
//                     onChange={(e) => setTestConfig({...testConfig, questionCount: parseInt(e.target.value)})}
//                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                   />
//                   <div className="flex justify-between text-sm text-gray-500 mt-2">
//                     <span>10 questions</span>
//                     <span>60 questions</span>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-3">
//                     Difficulty Level
//                   </label>
//                   <div className="grid grid-cols-3 gap-3">
//                     {["beginner", "intermediate", "advanced"].map(level => (
//                       <button
//                         key={level}
//                         onClick={() => setTestConfig({...testConfig, difficulty: level})}
//                         className={`p-3 rounded-lg capitalize transition ${
//                           testConfig.difficulty === level
//                             ? "bg-indigo-600 text-white"
//                             : "bg-gray-100 hover:bg-gray-200 text-gray-700"
//                         }`}
//                       >
//                         {level}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
//                 <h3 className="font-semibold text-gray-800 mb-4">Test Summary</h3>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Subject:</span>
//                     <span className="font-medium">{testConfig.subject || "Not selected"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Questions:</span>
//                     <span className="font-medium">{testConfig.questionCount}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Difficulty:</span>
//                     <span className="font-medium capitalize">{testConfig.difficulty}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Est. Time:</span>
//                     <span className="font-medium">{Math.round(testConfig.questionCount * 1.5)} min</span>
//                   </div>
//                 </div>

//                 <button
//                   onClick={generateQuestions}
//                   disabled={!testConfig.subject || loading}
//                   className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
//                 >
//                   {loading ? "🔄 Generating Questions..." : "🚀 Start Test"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Test Screen
//   if (currentScreen === "test") {
//     const currentQuestion = questions[currentQuestionIndex];
//     const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-800">{testConfig.subject} Test</h1>
//                 <p className="text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
//               </div>
//               <div className="text-right">
//                 <div className="text-2xl font-mono font-bold text-indigo-600">
//                   {formatTime(timeRemaining)}
//                 </div>
//                 <p className="text-sm text-gray-500">Time Remaining</p>
//               </div>
//             </div>
            
//             {/* Progress Bar */}
//             <div className="mt-4">
//               <div className="bg-gray-200 rounded-full h-2">
//                 <div 
//                   className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
//                   style={{width: `${progress}%`}}
//                 ></div>
//               </div>
//             </div>
//           </div>

//           {/* Question Card */}
//           <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
//             <div className="flex justify-between items-start mb-6">
//               <h2 className="text-xl font-semibold text-gray-800 flex-1">
//                 {currentQuestion?.question}
//               </h2>
//               <button
//                 onClick={saveQuestion}
//                 className="ml-4 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition flex items-center gap-2 text-sm font-medium"
//               >
//                 <span>💾</span> Save Question
//               </button>
//             </div>

//             <div className="space-y-3">
//               {currentQuestion?.options?.map((option, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleAnswerSelect(option[0])} // A, B, C, D
//                   className={`w-full p-4 text-left rounded-lg border-2 transition ${
//                     userAnswers[currentQuestionIndex] === option[0]
//                       ? "border-indigo-500 bg-indigo-50 text-indigo-800"
//                       : "border-gray-200 hover:border-gray-300 bg-white"
//                   }`}
//                 >
//                   <span className="font-medium">{option}</span>
//                 </button>
//               ))}
//             </div>

//             {/* Navigation */}
//             <div className="flex justify-between items-center mt-8">
//               <button
//                 onClick={previousQuestion}
//                 disabled={currentQuestionIndex === 0}
//                 className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
//               >
//                 ← Previous
//               </button>

//               <div className="flex gap-2">
//                 {questions.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setCurrentQuestionIndex(index)}
//                     className={`w-10 h-10 rounded-full text-sm font-medium transition ${
//                       userAnswers[index] 
//                         ? "bg-green-500 text-white" 
//                         : index === currentQuestionIndex
//                         ? "bg-indigo-600 text-white"
//                         : "bg-gray-200 text-gray-600 hover:bg-gray-300"
//                     }`}
//                   >
//                     {index + 1}
//                   </button>
//                 ))}
//               </div>

//               {currentQuestionIndex === questions.length - 1 ? (
//                 <button
//                   onClick={finishTest}
//                   className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition"
//                 >
//                   Finish Test
//                 </button>
//               ) : (
//                 <button
//                   onClick={nextQuestion}
//                   className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
//                 >
//                   Next →
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Results Screen
//   if (currentScreen === "results" && testResults) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
//         <div className="max-w-6xl mx-auto">
//           {/* Results Header */}
//           <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
//             <div className="text-center">
//               <div className="text-6xl mb-4">
//                 {testResults.grade === "A" ? "🏆" : testResults.grade === "B" ? "🥈" : testResults.grade === "C" ? "🥉" : "📚"}
//               </div>
//               <h1 className="text-4xl font-bold text-gray-800 mb-2">Test Complete!</h1>
//               <p className="text-gray-600 mb-6">{testConfig.subject} • {testResults.totalQuestions} Questions</p>
              
//               <div className="grid md:grid-cols-4 gap-6">
//                 <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg p-4">
//                   <div className="text-3xl font-bold">{testResults.score}%</div>
//                   <div className="text-sm opacity-90">Final Score</div>
//                 </div>
//                 <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg p-4">
//                   <div className="text-3xl font-bold">{testResults.grade}</div>
//                   <div className="text-sm opacity-90">Grade</div>
//                 </div>
//                 <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-lg p-4">
//                   <div className="text-3xl font-bold">{testResults.correctCount}</div>
//                   <div className="text-sm opacity-90">Correct</div>
//                 </div>
//                 <div className="bg-gradient-to-br from-gray-500 to-slate-600 text-white rounded-lg p-4">
//                   <div className="text-3xl font-bold">{testResults.totalQuestions - testResults.correctCount}</div>
//                   <div className="text-sm opacity-90">Incorrect</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Detailed Results */}
//           <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">Question Review</h2>
//             <div className="space-y-4 max-h-96 overflow-y-auto">
//               {testResults.details.map((result, index) => (
//                 <div 
//                   key={index}
//                   className={`p-4 rounded-lg border-l-4 ${
//                     result.isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
//                   }`}
//                 >
//                   <div className="flex items-start justify-between mb-2">
//                     <span className="font-medium text-gray-800">Q{index + 1}:</span>
//                     <span className={`px-2 py-1 rounded text-sm font-medium ${
//                       result.isCorrect ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
//                     }`}>
//                       {result.isCorrect ? "✓ Correct" : "✗ Incorrect"}
//                     </span>
//                   </div>
//                   <p className="text-gray-700 mb-2">{result.question}</p>
//                   <div className="text-sm space-y-1">
//                     <p><strong>Your answer:</strong> {result.userAnswer || "Not answered"}</p>
//                     <p><strong>Correct answer:</strong> {result.correctAnswer}</p>
//                     {result.explanation && (
//                       <p className="text-gray-600 italic">{result.explanation}</p>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Saved Questions */}
//           {savedQuestions.length > 0 && (
//             <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">Saved Questions ({savedQuestions.length})</h2>
//               <div className="space-y-3">
//                 {savedQuestions.map((q, index) => (
//                   <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                     <p className="font-medium">{q.question}</p>
//                     <p className="text-sm text-gray-600 mt-1">Correct Answer: {q.correct_answer}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Actions */}
//           <div className="flex justify-center gap-4">
//             <button
//               onClick={resetTest}
//               className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition shadow-lg"
//             >
//               Take Another Test
//             </button>
//             <button
//               onClick={() => setShowSetup(true)}
//               className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition shadow-lg"
//             >
//               Change API Key
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return null;
// }




































// import React, { useState, useRef } from "react";

// export default function TranslatePage() {
//   const [messages, setMessages] = useState([]);
//   const [userInput, setUserInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [apiKey, setApiKey] = useState("");
//   const [showSetup, setShowSetup] = useState(true);
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const fileInputRef = useRef(null);

//   // Groq API configuration - using vision model for image analysis
//   const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
//   const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"; // Vision model for image analysis
//   const TEXT_MODEL = "llama-3.3-70b-versatile"; // Fast text model

//   const convertToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const fileReader = new FileReader();
//       fileReader.readAsDataURL(file);
//       fileReader.onload = () => {
//         resolve(fileReader.result);
//       };
//       fileReader.onerror = (error) => {
//         reject(error);
//       };
//     });
//   };

//   const handleImageUpload = async (event) => {
//     const file = event.target.files[0];
//     if (file && file.type.startsWith('image/')) {
//       try {
//         const base64 = await convertToBase64(file);
//         setUploadedImage({
//           file: file,
//           base64: base64,
//           name: file.name
//         });
//       } catch (error) {
//         console.error('Error converting image to base64:', error);
//       }
//     }
//   };

//   const removeImage = () => {
//     setUploadedImage(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const sendMessage = async () => {
//     if ((!userInput.trim() && !uploadedImage) || !apiKey) return;

//     // Create user message with optional image
//     const newUserMessage = {
//       role: "user",
//       content: uploadedImage ? [
//         {
//           type: "text",
//           text: userInput.trim() || "Please analyze this image and describe what you see."
//         },
//         {
//           type: "image_url",
//           image_url: {
//             url: uploadedImage.base64
//           }
//         }
//       ] : userInput
//     };

//     const allMessages = [...messages, newUserMessage];
//     setMessages(allMessages);
//     setUserInput("");
//     const currentImage = uploadedImage;
//     setUploadedImage(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//     setLoading(true);

//     try {
//       // Use vision model if there's an image, otherwise use fast text model
//       const modelToUse = currentImage ? MODEL : TEXT_MODEL;
      
//       const response = await fetch(GROQ_API_URL, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${apiKey}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: modelToUse,
//           messages: allMessages,
//           temperature: 0.7,
//           max_tokens: 1024,
//           top_p: 0.9,
//         }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error?.message || `API Error: ${response.status}`);
//       }

//       const data = await response.json();
//       const assistantMessage = data.choices[0]?.message?.content || "No response";

//       setMessages([...allMessages, { role: "assistant", content: assistantMessage }]);
//     } catch (err) {
//       setMessages([
//         ...allMessages,
//         { 
//           role: "assistant", 
//           content: `❌ Error: ${err.message}\n\nPlease check your API key and try again.${currentImage ? '\n\nNote: Make sure your API key has access to vision models.' : ''}` 
//         }
//       ]);
//     }

//     setLoading(false);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const clearChat = () => {
//     setMessages([]);
//   };

//   const saveApiKey = () => {
//     if (apiKey.trim()) {
//       setShowSetup(false);
//     }
//   };

//   const tryExampleMessage = (example) => {
//     setUserInput(example);
//   };

//   const examples = [
//     "Explain quantum computing in simple terms",
//     "Write a Python function to sort a list",
//     "What are the benefits of meditation?",
//   ];

//   // Setup screen
//   if (showSetup) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
//           <div className="text-center mb-8">
//             <div className="text-6xl mb-4">🚀</div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
//               EduBridge AI Chat Assistant
//             </h1>
//             <p className="text-gray-600">Powered by EduBridge - Lightning Fast AI with Vision</p>
//           </div>

//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
//             <h2 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
//               <span>🔑</span> Get Your Free API Key
//             </h2>
//             <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
//               <li>Visit <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-blue-600">console.groq.com</a></li>
//               <li>Sign up for a free account (GitHub/Google login available)</li>
//               <li>Go to "API Keys" section</li>
//               <li>Create a new API key</li>
//               <li>Copy and paste it below</li>
//             </ol>
//             <p className="text-xs text-blue-700 mt-3 italic">
//               ✨ Free tier includes text + vision capabilities!
//             </p>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Groq API Key
//               </label>
//               <input
//                 type="password"
//                 placeholder="gsk_..."
//                 value={apiKey}
//                 onChange={(e) => setApiKey(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 onKeyPress={(e) => e.key === "Enter" && saveApiKey()}
//               />
//             </div>

//             <button
//               onClick={saveApiKey}
//               disabled={!apiKey.trim()}
//               className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
//             >
//               Start Chatting →
//             </button>
//           </div>

//           <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//             <p className="text-xs text-gray-600">
//               <strong>Privacy:</strong> Your API key is stored only in browser memory and never sent anywhere except directly to Groq's servers.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Chat interface
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col p-4">
//       <div className="max-w-5xl w-full mx-auto flex flex-col h-screen">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4 bg-white rounded-lg shadow-sm p-4">
//           <div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               AI Chat Assistant
//             </h1>
//             <p className="text-sm text-gray-500 mt-1">⚡ Powered by Groq - Text & Vision AI</p>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setShowSetup(true)}
//               className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
//             >
//               🔑 Change Key
//             </button>
//             <button
//               onClick={clearChat}
//               className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
//             >
//               🗑️ Clear
//             </button>
//           </div>
//         </div>

//         {/* Chat Messages */}
//         <div className="flex-1 overflow-auto border border-gray-200 rounded-lg p-6 bg-white mb-4 shadow-sm">
//           {messages.length === 0 ? (
//             <div className="text-center text-gray-400 mt-20">
//               <div className="text-6xl mb-4">💬</div>
//               <p className="text-xl font-semibold text-gray-600 mb-2">Start a Conversation</p>
//               <p className="text-sm mb-6">Try text prompts or upload an image to analyze:</p>
//               <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
//                 {examples.map((example, i) => (
//                   <button
//                     key={i}
//                     onClick={() => tryExampleMessage(example)}
//                     className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm transition"
//                   >
//                     {example}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             messages.map((m, i) => (
//               <div
//                 key={i}
//                 className={`mb-6 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
//               >
//                 <div
//                   className={`max-w-3xl p-4 rounded-2xl shadow-sm ${
//                     m.role === "user"
//                       ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
//                       : "bg-gray-50 text-gray-800 border border-gray-200"
//                   }`}
//                 >
//                   <div className="text-xs font-bold mb-2 opacity-75">
//                     {m.role === "user" ? "You" : "🤖 Assistant"}
//                   </div>
//                   {/* Handle both text and image content */}
//                   {Array.isArray(m.content) ? (
//                     <div className="space-y-3">
//                       {m.content.map((item, idx) => (
//                         <div key={idx}>
//                           {item.type === "text" && (
//                             <div className="whitespace-pre-wrap leading-relaxed">{item.text}</div>
//                           )}
//                           {item.type === "image_url" && (
//                             <div className="mt-2">
//                               <img 
//                                 src={item.image_url.url} 
//                                 alt="Uploaded image" 
//                                 className="max-w-full h-auto rounded-lg shadow-sm"
//                                 style={{maxHeight: '200px'}}
//                               />
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}
          
//           {loading && (
//             <div className="flex justify-start mb-6">
//               <div className="max-w-3xl p-4 rounded-2xl bg-gray-50 border border-gray-200">
//                 <div className="flex items-center gap-2 text-gray-500">
//                   <div className="flex gap-1">
//                     <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
//                     <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
//                     <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                   </div>
//                   <span className="text-sm font-medium">AI is analyzing...</span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Image Preview */}
//         {uploadedImage && (
//           <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm font-medium text-gray-700">📷 Image ready for analysis:</span>
//               <button
//                 onClick={removeImage}
//                 className="text-red-500 hover:text-red-700 text-sm font-medium"
//               >
//                 ✕ Remove
//               </button>
//             </div>
//             <div className="flex items-center gap-3">
//               <img 
//                 src={uploadedImage.base64} 
//                 alt="Upload preview" 
//                 className="w-16 h-16 object-cover rounded-lg border border-gray-200"
//               />
//               <span className="text-sm text-gray-600">{uploadedImage.name}</span>
//             </div>
//           </div>
//         )}

//         {/* Input Area */}
//         <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
//           <div className="flex gap-3 items-end">
//             <div className="flex-1">
//               <textarea
//                 rows="2"
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
//                 placeholder={uploadedImage ? "Ask something about the image..." : "Type your message... (Enter to send, Shift+Enter for new line)"}
//                 value={userInput}
//                 onChange={(e) => setUserInput(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 disabled={loading}
//               />
//             </div>
//             <div className="flex gap-2">
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 className="hidden"
//                 ref={fileInputRef}
//                 disabled={loading}
//               />
//               <button
//                 onClick={() => fileInputRef.current?.click()}
//                 className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={loading}
//                 title="Upload image"
//               >
//                 📷
//               </button>
//               <button
//                 className="px-8 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold shadow-md"
//                 onClick={sendMessage}
//                 disabled={loading || (!userInput.trim() && !uploadedImage)}
//               >
//                 {loading ? "⏳" : "Send ⚡"}
//               </button>
//             </div>
//           </div>
//           <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
//             <span>Using Groq API - {uploadedImage ? 'Vision analysis ready' : 'Ultra-fast responses'}</span>
//             <span>{messages.length} messages</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


























// import React, { useState } from "react";

// export default function TranslatePage() {
//   const [messages, setMessages] = useState([]);
//   const [userInput, setUserInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [apiKey, setApiKey] = useState("");
//   const [showSetup, setShowSetup] = useState(true);

//   // Groq API configuration
//   const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
//   const MODEL = "llama-3.3-70b-versatile"; // Fast and free

//   const sendMessage = async () => {
//     if (!userInput.trim() || !apiKey) return;

//     const newUser = { role: "user", content: userInput };
//     const allMessages = [...messages, newUser];
//     setMessages(allMessages);
//     setUserInput("");
//     setLoading(true);

//     try {
//       const response = await fetch(GROQ_API_URL, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${apiKey}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: MODEL,
//           messages: allMessages,
//           temperature: 0.7,
//           max_tokens: 1024,
//           top_p: 0.9,
//         }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error?.message || `API Error: ${response.status}`);
//       }

//       const data = await response.json();
//       const assistantMessage = data.choices[0]?.message?.content || "No response";

//       setMessages([...allMessages, { role: "assistant", content: assistantMessage }]);
//     } catch (err) {
//       setMessages([
//         ...allMessages,
//         { 
//           role: "assistant", 
//           content: `❌ Error: ${err.message}\n\nPlease check your API key and try again.` 
//         }
//       ]);
//     }

//     setLoading(false);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const clearChat = () => {
//     setMessages([]);
//   };

//   const saveApiKey = () => {
//     if (apiKey.trim()) {
//       setShowSetup(false);
//     }
//   };

//   const tryExampleMessage = (example) => {
//     setUserInput(example);
//   };

//   const examples = [
//     "Explain quantum computing in simple terms",
//     "Write a Python function to sort a list",
//     "What are the benefits of meditation?",
//   ];

//   // Setup screen
//   if (showSetup) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
//           <div className="text-center mb-8">
//             <div className="text-6xl mb-4">🚀</div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
//               AI Chat Assistant
//             </h1>
//             <p className="text-gray-600">Powered by Groq - Lightning Fast AI</p>
//           </div>

//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
//             <h2 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
//               <span>🔑</span> Get Your Free API Key
//             </h2>
//             <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
//               <li>Visit <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-blue-600">console.groq.com</a></li>
//               <li>Sign up for a free account (GitHub/Google login available)</li>
//               <li>Go to "API Keys" section</li>
//               <li>Create a new API key</li>
//               <li>Copy and paste it below</li>
//             </ol>
//             <p className="text-xs text-blue-700 mt-3 italic">
//               ✨ Free tier includes 14,400 requests per day!
//             </p>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Groq API Key
//               </label>
//               <input
//                 type="password"
//                 placeholder="gsk_..."
//                 value={apiKey}
//                 onChange={(e) => setApiKey(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 onKeyPress={(e) => e.key === "Enter" && saveApiKey()}
//               />
//             </div>

//             <button
//               onClick={saveApiKey}
//               disabled={!apiKey.trim()}
//               className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
//             >
//               Start Chatting →
//             </button>
//           </div>

//           <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//             <p className="text-xs text-gray-600">
//               <strong>Privacy:</strong> Your API key is stored only in browser memory and never sent anywhere except directly to Groq's servers.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Chat interface
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col p-4">
//       <div className="max-w-5xl w-full mx-auto flex flex-col h-screen">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4 bg-white rounded-lg shadow-sm p-4">
//           <div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               AI Chat Assistant
//             </h1>
//             <p className="text-sm text-gray-500 mt-1">⚡ Powered by Groq - {MODEL}</p>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setShowSetup(true)}
//               className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
//             >
//               🔑 Change Key
//             </button>
//             <button
//               onClick={clearChat}
//               className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
//             >
//               🗑️ Clear
//             </button>
//           </div>
//         </div>

//         {/* Chat Messages */}
//         <div className="flex-1 overflow-auto border border-gray-200 rounded-lg p-6 bg-white mb-4 shadow-sm">
//           {messages.length === 0 ? (
//             <div className="text-center text-gray-400 mt-20">
//               <div className="text-6xl mb-4">💬</div>
//               <p className="text-xl font-semibold text-gray-600 mb-2">Start a Conversation</p>
//               <p className="text-sm mb-6">Try one of these examples:</p>
//               <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
//                 {examples.map((example, i) => (
//                   <button
//                     key={i}
//                     onClick={() => tryExampleMessage(example)}
//                     className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm transition"
//                   >
//                     {example}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             messages.map((m, i) => (
//               <div
//                 key={i}
//                 className={`mb-6 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
//               >
//                 <div
//                   className={`max-w-3xl p-4 rounded-2xl shadow-sm ${
//                     m.role === "user"
//                       ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
//                       : "bg-gray-50 text-gray-800 border border-gray-200"
//                   }`}
//                 >
//                   <div className="text-xs font-bold mb-2 opacity-75">
//                     {m.role === "user" ? "You" : "🤖 Assistant"}
//                   </div>
//                   <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
//                 </div>
//               </div>
//             ))
//           )}
          
//           {loading && (
//             <div className="flex justify-start mb-6">
//               <div className="max-w-3xl p-4 rounded-2xl bg-gray-50 border border-gray-200">
//                 <div className="flex items-center gap-2 text-gray-500">
//                   <div className="flex gap-1">
//                     <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
//                     <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
//                     <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                   </div>
//                   <span className="text-sm font-medium">AI is thinking...</span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Input Area */}
//         <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
//           <div className="flex gap-3">
//             <textarea
//               rows="2"
//               className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
//               placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
//               value={userInput}
//               onChange={(e) => setUserInput(e.target.value)}
//               onKeyPress={handleKeyPress}
//               disabled={loading}
//             />
//             <button
//               className="px-8 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold shadow-md"
//               onClick={sendMessage}
//               disabled={loading || !userInput.trim()}
//             >
//               {loading ? "⏳" : "Send ⚡"}
//             </button>
//           </div>
//           <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
//             <span>Using Groq API - Ultra-fast responses</span>
//             <span>{messages.length} messages</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




























// DeepSeekHFChat.jsx
// import React, { useState } from "react";


// export default function DeepSeekHFChat() {
//   const [messages, setMessages] = useState([]);
//   const [userInput, setUserInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const HF_TOKEN = "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"; // get from huggingface.co/settings/tokens
//   const HF_MODEL = "deepseek-ai/DeepSeek-V3.1-Terminus"; // free model on Hugging Face

//   const sendMessage = async () => {
//     if (!userInput.trim()) return;

//     const newUser = { role: "user", content: userInput };
//     const all = [...messages, newUser];
//     setMessages(all);
//     setUserInput("");
//     setLoading(true);

//     try {
//       const res = await fetch(
//         `https://api-inference.huggingface.co/models/${HF_MODEL}`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${HF_TOKEN}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             inputs: userInput,
//             parameters: { max_new_tokens: 200 },
//           }),
//         }
//       );

//       const data = await res.json();
//       // Hugging Face returns { generated_text: "..."}
//       let reply = "";
//       if (Array.isArray(data) && data[0]?.generated_text) {
//         reply = data[0].generated_text;
//       } else {
//         reply = "⚠️ Error: " + JSON.stringify(data);
//       }

//       setMessages([...all, { role: "assistant", content: reply }]);
//     } catch (err) {
//       setMessages([...all, { role: "assistant", content: "⚠️ API error: " + err.message }]);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col p-4">
//       <h1 className="text-2xl font-bold text-indigo-600 mb-4">
//         Chat with DeepSeek (via Hugging Face)
//       </h1>

//       <div className="flex-1 overflow-auto border rounded p-4 bg-white mb-4">
//         {messages.map((m, i) => (
//           <div key={i} className={m.role === "user" ? "text-right mb-2" : "text-left mb-2"}>
//             <div
//               className={`inline-block p-2 rounded-lg ${
//                 m.role === "user" ? "bg-indigo-100" : "bg-gray-100"
//               }`}
//             >
//               {m.content}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="flex gap-2">
//         <textarea
//           rows="2"
//           className="flex-1 p-2 border rounded"
//           placeholder="Type your message..."
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//         />
//         <button
//           className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
//           onClick={sendMessage}
//           disabled={loading}
//         >
//           {loading ? "Thinking..." : "Send"}
//         </button>
//       </div>
//     </div>
//   );
// }
