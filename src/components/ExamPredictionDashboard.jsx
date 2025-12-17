import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Calendar, AlertCircle, BookOpen, BarChart3 } from 'lucide-react';

const ExamPredictionDashboard = () => {
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedExam, setSelectedExam] = useState('JAMB');
  const [daysUntilExam, setDaysUntilExam] = useState(60);
  const [studentReadiness, setStudentReadiness] = useState({});

  // Mock historical data - 15 years of past questions
  const historicalData = {
    Mathematics: {
      JAMB: [
        { topic: 'Quadratic Equations', appearances: [2010, 2012, 2015, 2018, 2021, 2024], frequency: 6, lastAppeared: 2024, difficulty: 'Medium' },
        { topic: 'Trigonometry', appearances: [2009, 2011, 2013, 2016, 2019, 2022], frequency: 6, lastAppeared: 2022, difficulty: 'Hard' },
        { topic: 'Calculus', appearances: [2010, 2013, 2016, 2020, 2023], frequency: 5, lastAppeared: 2023, difficulty: 'Hard' },
        { topic: 'Statistics', appearances: [2011, 2014, 2017, 2020], frequency: 4, lastAppeared: 2020, difficulty: 'Medium' },
        { topic: 'Coordinate Geometry', appearances: [2012, 2015, 2018, 2021], frequency: 4, lastAppeared: 2021, difficulty: 'Medium' },
        { topic: 'Logarithms', appearances: [2009, 2012, 2016, 2019], frequency: 4, lastAppeared: 2019, difficulty: 'Medium' },
        { topic: 'Sequences and Series', appearances: [2013, 2017, 2022], frequency: 3, lastAppeared: 2022, difficulty: 'Hard' },
        { topic: 'Probability', appearances: [2014, 2018, 2023], frequency: 3, lastAppeared: 2023, difficulty: 'Easy' }
      ],
      WAEC: [
        { topic: 'Algebra', appearances: [2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024], frequency: 8, lastAppeared: 2024, difficulty: 'Medium' },
        { topic: 'Geometry', appearances: [2009, 2011, 2013, 2015, 2017, 2019, 2021, 2023], frequency: 8, lastAppeared: 2023, difficulty: 'Medium' },
        { topic: 'Trigonometry', appearances: [2010, 2013, 2016, 2019, 2022], frequency: 5, lastAppeared: 2022, difficulty: 'Hard' },
        { topic: 'Statistics', appearances: [2011, 2014, 2017, 2020, 2023], frequency: 5, lastAppeared: 2023, difficulty: 'Easy' },
        { topic: 'Calculus', appearances: [2012, 2015, 2018, 2021], frequency: 4, lastAppeared: 2021, difficulty: 'Hard' }
      ]
    },
    Physics: {
      JAMB: [
        { topic: 'Mechanics', appearances: [2009, 2011, 2013, 2015, 2017, 2019, 2021, 2023], frequency: 8, lastAppeared: 2023, difficulty: 'Hard' },
        { topic: 'Electricity', appearances: [2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024], frequency: 8, lastAppeared: 2024, difficulty: 'Medium' },
        { topic: 'Waves and Optics', appearances: [2011, 2014, 2017, 2020], frequency: 4, lastAppeared: 2020, difficulty: 'Medium' },
        { topic: 'Thermodynamics', appearances: [2012, 2015, 2018, 2021], frequency: 4, lastAppeared: 2021, difficulty: 'Hard' },
        { topic: 'Modern Physics', appearances: [2013, 2016, 2019, 2022], frequency: 4, lastAppeared: 2022, difficulty: 'Hard' }
      ]
    },
    Chemistry: {
      JAMB: [
        { topic: 'Organic Chemistry', appearances: [2009, 2011, 2013, 2015, 2017, 2019, 2021, 2023], frequency: 8, lastAppeared: 2023, difficulty: 'Hard' },
        { topic: 'Chemical Bonding', appearances: [2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024], frequency: 8, lastAppeared: 2024, difficulty: 'Medium' },
        { topic: 'Acids and Bases', appearances: [2011, 2014, 2017, 2020, 2023], frequency: 5, lastAppeared: 2023, difficulty: 'Easy' },
        { topic: 'Electrochemistry', appearances: [2012, 2015, 2018, 2021], frequency: 4, lastAppeared: 2021, difficulty: 'Hard' },
        { topic: 'Chemical Equilibrium', appearances: [2013, 2016, 2019, 2022], frequency: 4, lastAppeared: 2022, difficulty: 'Medium' }
      ]
    }
  };

  // Mock student performance data
  const mockStudentPerformance = {
    'Quadratic Equations': 85,
    'Trigonometry': 45,
    'Calculus': 60,
    'Statistics': 90,
    'Coordinate Geometry': 70,
    'Logarithms': 55,
    'Sequences and Series': 40,
    'Probability': 80,
    'Mechanics': 65,
    'Electricity': 75,
    'Waves and Optics': 50,
    'Thermodynamics': 35,
    'Modern Physics': 45,
    'Organic Chemistry': 55,
    'Chemical Bonding': 80,
    'Acids and Bases': 85,
    'Electrochemistry': 40,
    'Chemical Equilibrium': 60
  };

  useEffect(() => {
    setStudentReadiness(mockStudentPerformance);
  }, []);

  const calculateProbability = (topic) => {
    const currentYear = 2025;
    const yearsSinceLastAppearance = currentYear - topic.lastAppeared;
    const averageInterval = topic.appearances.length > 1 ? 
      (topic.appearances[topic.appearances.length - 1] - topic.appearances[0]) / (topic.appearances.length - 1) : 3;
    
    let probability = 0;
    
    if (yearsSinceLastAppearance >= averageInterval) {
      probability = Math.min(95, 60 + (yearsSinceLastAppearance - averageInterval) * 15);
    } else {
      probability = Math.max(10, 60 - (averageInterval - yearsSinceLastAppearance) * 10);
    }
    
    // Adjust based on frequency
    if (topic.frequency >= 6) probability += 10;
    else if (topic.frequency <= 3) probability -= 10;
    
    return Math.max(10, Math.min(95, Math.round(probability)));
  };

  const getTopicStatus = (topic) => {
    const probability = calculateProbability(topic);
    const yearsSince = 2025 - topic.lastAppeared;
    
    if (yearsSince >= 3) return { status: 'overdue', color: 'red' };
    if (yearsSince >= 2) return { status: 'due-soon', color: 'yellow' };
    return { status: 'recent', color: 'green' };
  };

  const getPredictions = () => {
    const topics = historicalData[selectedSubject]?.[selectedExam] || [];
    return topics
      .map(topic => ({
        ...topic,
        probability: calculateProbability(topic),
        status: getTopicStatus(topic),
        studentScore: studentReadiness[topic.topic] || 0
      }))
      .sort((a, b) => b.probability - a.probability);
  };

  const getReadinessScore = () => {
    const predictions = getPredictions();
    const highProbTopics = predictions.filter(t => t.probability >= 70);
    
    if (highProbTopics.length === 0) return 100;
    
    const totalScore = highProbTopics.reduce((sum, topic) => sum + topic.studentScore, 0);
    return Math.round(totalScore / highProbTopics.length);
  };

  const predictions = getPredictions();
  const readinessScore = getReadinessScore();
  const hotTopics = predictions.slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-full flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Exam Prediction Engine</h1>
              <p className="text-gray-600">AI-powered analysis of 15 years of past questions</p>
            </div>
          </div>

          {/* Controls */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Type</label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="JAMB">JAMB</option>
                <option value="WAEC">WAEC</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Days Until Exam</label>
              <input
                type="number"
                value={daysUntilExam}
                onChange={(e) => setDaysUntilExam(parseInt(e.target.value))}
                min="1"
                max="365"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Predictions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Readiness Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-indigo-600" />
                2025 Exam Readiness
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${
                    readinessScore >= 80 ? 'text-green-600' : 
                    readinessScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {readinessScore}%
                  </div>
                  <div className="text-gray-600">Overall Readiness</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    {hotTopics.filter(t => t.probability >= 70).length}
                  </div>
                  <div className="text-gray-600">High-Probability Topics</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {hotTopics.filter(t => t.probability >= 70 && t.studentScore < 60).length}
                  </div>
                  <div className="text-gray-600">Gaps to Address</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 rounded-xl p-4">
                <p className="text-gray-700">
                  <strong>Analysis:</strong> Based on 15 years of {selectedExam} {selectedSubject} questions, 
                  you're {readinessScore >= 80 ? 'well-prepared' : readinessScore >= 60 ? 'moderately prepared' : 'need significant preparation'} 
                  for the predicted topics. Focus on the high-probability gaps below.
                </p>
              </div>
            </div>

            {/* Hot Topics for 2025 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-red-600" />
                Hot Topics for 2025
              </h2>
              
              <div className="space-y-4">
                {hotTopics.map((topic, index) => (
                  <div key={topic.topic} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{topic.topic}</h3>
                          <p className="text-sm text-gray-600">
                            Last appeared: {topic.lastAppeared} • {topic.frequency} times in 15 years
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          topic.probability >= 80 ? 'text-red-600' : 
                          topic.probability >= 60 ? 'text-orange-600' : 'text-yellow-600'
                        }`}>
                          {topic.probability}%
                        </div>
                        <div className="text-sm text-gray-500">Probability</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Your Preparation</span>
                          <span>{topic.studentScore}%</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              topic.studentScore >= 80 ? 'bg-green-500' : 
                              topic.studentScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${topic.studentScore}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          topic.status.status === 'overdue' ? 'bg-red-500' : 
                          topic.status.status === 'due-soon' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <span className="text-sm text-gray-600 capitalize">
                          {topic.status.status.replace('-', ' ')} • {topic.difficulty} difficulty
                        </span>
                      </div>
                    </div>

                    {topic.probability >= 70 && topic.studentScore < 60 && (
                      <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-red-800">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Priority Gap!</span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">
                          High probability topic with low preparation. Recommend immediate focus.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pattern Insights */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Pattern Insights
              </h3>
              <div className="space-y-4 text-sm">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-blue-800">
                    <strong>Trigonometry</strong> appears every 3 years on average. 
                    Last seen in 2022, high probability for 2025.
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-green-800">
                    <strong>Statistics</strong> hasn't appeared since 2020. 
                    Due for comeback in 2025.
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-orange-800">
                    <strong>Calculus</strong> alternates with Coordinate Geometry. 
                    Calculus more likely this year.
                  </p>
                </div>
              </div>
            </div>

            {/* Study Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Recommended Focus
              </h3>
              <div className="space-y-3">
                {hotTopics
                  .filter(t => t.probability >= 70 && t.studentScore < 70)
                  .slice(0, 5)
                  .map((topic, index) => (
                    <div key={topic.topic} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <div className="font-medium text-red-800">{topic.topic}</div>
                        <div className="text-xs text-red-600">
                          {topic.probability}% likely • {topic.studentScore}% ready
                        </div>
                      </div>
                      <button className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition">
                        Study Now
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Exam Countdown */}
            <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-xl shadow-lg p-6 text-white">
              <div className="text-center">
                <Calendar className="w-12 h-12 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-2">{daysUntilExam}</div>
                <div className="text-gray-100">Days Until {selectedExam}</div>
                <div className="mt-4 text-sm text-gray-100">
                  {daysUntilExam > 60 ? 'Plenty of time to prepare' : 
                   daysUntilExam > 30 ? 'Focus on high-probability topics' : 
                   'Emergency mode: Only study likely topics'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPredictionDashboard;