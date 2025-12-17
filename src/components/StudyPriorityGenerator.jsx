import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Target, TrendingUp, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

const StudyPriorityGenerator = ({ examDate = '2025-05-15', dailyStudyHours = 2 }) => {
  const [priorities, setPriorities] = useState([]);
  const [selectedView, setSelectedView] = useState('daily');
  const [currentDate] = useState(new Date());

  // Mock data for topics with predictions and student performance
  const topicData = [
    { topic: 'Trigonometry', examProbability: 85, studentPerformance: 45, difficulty: 'Hard', estimatedHours: 8 },
    { topic: 'Statistics', examProbability: 80, studentPerformance: 90, difficulty: 'Easy', estimatedHours: 4 },
    { topic: 'Calculus', examProbability: 75, studentPerformance: 60, difficulty: 'Hard', estimatedHours: 10 },
    { topic: 'Quadratic Equations', examProbability: 70, studentPerformance: 85, difficulty: 'Medium', estimatedHours: 5 },
    { topic: 'Coordinate Geometry', examProbability: 65, studentPerformance: 70, difficulty: 'Medium', estimatedHours: 6 },
    { topic: 'Logarithms', examProbability: 60, studentPerformance: 55, difficulty: 'Medium', estimatedHours: 5 },
    { topic: 'Sequences and Series', examProbability: 55, studentPerformance: 40, difficulty: 'Hard', estimatedHours: 7 },
    { topic: 'Probability', examProbability: 50, studentPerformance: 80, difficulty: 'Easy', estimatedHours: 3 }
  ];

  const getDaysUntilExam = () => {
    const exam = new Date(examDate);
    const today = new Date();
    return Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
  };

  const calculatePriorityScore = (topic, daysUntilExam) => {
    const { examProbability, studentPerformance, difficulty } = topic;
    
    // Base score from probability and performance gap
    let score = examProbability + (100 - studentPerformance);
    
    // Difficulty multiplier
    const difficultyMultiplier = {
      'Easy': 0.8,
      'Medium': 1.0,
      'Hard': 1.2
    };
    score *= difficultyMultiplier[difficulty];
    
    // Time urgency factor
    if (daysUntilExam <= 14) {
      // Emergency mode: heavily prioritize high-probability topics
      score += examProbability * 0.5;
    } else if (daysUntilExam <= 30) {
      // Focus mode: balance probability and gaps
      score += examProbability * 0.3;
    } else {
      // Preparation mode: focus on building foundation
      score += (100 - studentPerformance) * 0.3;
    }
    
    return Math.round(score);
  };

  const generateDailyPlan = (daysUntilExam) => {
    const sortedTopics = topicData
      .map(topic => ({
        ...topic,
        priorityScore: calculatePriorityScore(topic, daysUntilExam),
        gap: 100 - topic.studentPerformance
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore);

    const dailyPlan = [];
    let remainingHours = dailyStudyHours;
    
    for (const topic of sortedTopics) {
      if (remainingHours <= 0) break;
      
      // Skip topics that are already mastered (>85%) unless high probability
      if (topic.studentPerformance > 85 && topic.examProbability < 80) continue;
      
      const timeNeeded = Math.min(
        remainingHours,
        topic.gap > 40 ? 1.5 : topic.gap > 20 ? 1 : 0.5
      );
      
      if (timeNeeded > 0) {
        dailyPlan.push({
          ...topic,
          allocatedTime: timeNeeded,
          priority: dailyPlan.length === 0 ? 'High' : dailyPlan.length === 1 ? 'Medium' : 'Low'
        });
        remainingHours -= timeNeeded;
      }
    }
    
    return dailyPlan;
  };

  const generateWeeklyPlan = (daysUntilExam) => {
    const weeklyPlan = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    const sortedTopics = topicData
      .map(topic => ({
        ...topic,
        priorityScore: calculatePriorityScore(topic, daysUntilExam)
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore);

    days.forEach((day, index) => {
      const topicsForDay = sortedTopics.slice(index * 2, (index * 2) + 2);
      weeklyPlan[day] = topicsForDay.map(topic => ({
        ...topic,
        allocatedTime: dailyStudyHours / topicsForDay.length
      }));
    });
    
    return weeklyPlan;
  };

  const getExamReadiness = () => {
    const highProbTopics = topicData.filter(t => t.examProbability >= 70);
    const readyTopics = highProbTopics.filter(t => t.studentPerformance >= 70);
    return Math.round((readyTopics.length / highProbTopics.length) * 100);
  };

  const getUrgentTopics = (daysUntilExam) => {
    return topicData.filter(topic => 
      topic.examProbability >= 70 && 
      topic.studentPerformance < 60 &&
      daysUntilExam <= 30
    );
  };

  useEffect(() => {
    const daysUntilExam = getDaysUntilExam();
    const dailyPlan = generateDailyPlan(daysUntilExam);
    setPriorities(dailyPlan);
  }, [examDate, dailyStudyHours]);

  const daysUntilExam = getDaysUntilExam();
  const examReadiness = getExamReadiness();
  const urgentTopics = getUrgentTopics(daysUntilExam);
  const weeklyPlan = generateWeeklyPlan(daysUntilExam);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Intelligent Study Planner</h1>
              <p className="text-gray-600">AI-optimized study priorities based on exam predictions</p>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{daysUntilExam}</div>
              <div className="text-gray-600">Days Until Exam</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${
                examReadiness >= 80 ? 'text-green-600' : 
                examReadiness >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {examReadiness}%
              </div>
              <div className="text-gray-600">Exam Readiness</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{urgentTopics.length}</div>
              <div className="text-gray-600">Urgent Topics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{dailyStudyHours}h</div>
              <div className="text-gray-600">Daily Study Time</div>
            </div>
          </div>

          {/* Mode Indicator */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${
                daysUntilExam <= 14 ? 'bg-red-500' : 
                daysUntilExam <= 30 ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <span className="font-semibold text-gray-800">
                {daysUntilExam <= 14 ? 'Emergency Mode' : 
                 daysUntilExam <= 30 ? 'Focus Mode' : 'Preparation Mode'}
              </span>
              <span className="text-gray-600">
                {daysUntilExam <= 14 ? 'Only study high-probability topics' : 
                 daysUntilExam <= 30 ? 'Balance probability and weak areas' : 
                 'Build strong foundation across all topics'}
              </span>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setSelectedView('daily')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedView === 'daily' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Today's Plan
            </button>
            <button
              onClick={() => setSelectedView('weekly')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedView === 'weekly' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Weekly View
            </button>
          </div>

          {selectedView === 'daily' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-indigo-600" />
                Today's Study Plan ({dailyStudyHours} hours)
              </h2>
              
              <div className="space-y-4">
                {priorities.map((topic, index) => (
                  <div key={topic.topic} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          topic.priority === 'High' ? 'bg-red-500' : 
                          topic.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{topic.topic}</h3>
                          <p className="text-gray-600">
                            {topic.examProbability}% exam probability • {topic.studentPerformance}% current level
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">
                          {Math.round(topic.allocatedTime * 60)}min
                        </div>
                        <div className="text-sm text-gray-500">Recommended time</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Priority Score</div>
                        <div className="text-lg font-bold text-gray-800">{topic.priorityScore}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Difficulty</div>
                        <div className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                          topic.difficulty === 'Hard' ? 'bg-red-100 text-red-800' :
                          topic.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {topic.difficulty}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Improvement Needed</div>
                        <div className="text-lg font-bold text-orange-600">{topic.gap}%</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {topic.examProbability >= 80 && topic.studentPerformance < 60 && (
                          <div className="flex items-center gap-1 text-red-600 text-sm">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Critical Gap</span>
                          </div>
                        )}
                        {topic.studentPerformance >= 85 && (
                          <div className="flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>Well Prepared</span>
                          </div>
                        )}
                      </div>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2">
                        Start Studying
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedView === 'weekly' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-indigo-600" />
                Weekly Study Schedule
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(weeklyPlan).map(([day, topics]) => (
                  <div key={day} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">{day}</h3>
                    <div className="space-y-2">
                      {topics.map((topic, index) => (
                        <div key={topic.topic} className="bg-white rounded p-3 text-sm">
                          <div className="font-medium text-gray-800">{topic.topic}</div>
                          <div className="text-gray-600">
                            {Math.round(topic.allocatedTime * 60)}min • {topic.examProbability}% likely
                          </div>
                          <div className="mt-1">
                            <div className="bg-gray-200 rounded-full h-1">
                              <div 
                                className={`h-1 rounded-full ${
                                  topic.studentPerformance >= 80 ? 'bg-green-500' : 
                                  topic.studentPerformance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${topic.studentPerformance}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Adaptive Updates */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Adaptive Recommendations
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Today's Focus</h4>
              <p className="text-blue-700 text-sm">
                Based on your current performance, prioritize <strong>Trigonometry</strong> and <strong>Calculus</strong>. 
                These have high exam probability but low preparation scores.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Progress Update</h4>
              <p className="text-green-700 text-sm">
                Your plan automatically adjusts based on completed sessions. 
                Complete today's plan to see updated priorities for tomorrow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPriorityGenerator;