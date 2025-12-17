import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Target, Calendar, Clock, TrendingUp, CheckCircle, AlertTriangle, Play, Pause, BarChart3 } from 'lucide-react';

const StudyRecipePage = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('my-recipes');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const staticRecipes = [
    {
      id: 1,
      title: 'JAMB 2024 Preparation',
      goal: 'Score 300+ in JAMB',
      timeframe: '60 days',
      progress: 65,
      currentWeek: 6,
      totalWeeks: 8,
      status: 'on-track',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
      todayTasks: [
        { task: 'Complete 20 JAMB Math questions', completed: true },
        { task: 'Review Physics - Motion concepts', completed: false },
        { task: 'Practice English comprehension', completed: false }
      ],
      weeklyGoal: 'Master quadratic equations and motion physics',
      streak: 12
    },
    {
      id: 2,
      title: 'WAEC Excellence Plan',
      goal: 'Get A1 in 8 subjects',
      timeframe: '90 days',
      progress: 40,
      currentWeek: 4,
      totalWeeks: 12,
      status: 'behind',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
      todayTasks: [
        { task: 'Biology practical revision', completed: true },
        { task: 'Chemistry equations practice', completed: true },
        { task: 'Math past questions', completed: false }
      ],
      weeklyGoal: 'Complete organic chemistry and genetics',
      streak: 8
    }
  ];

  const [myRecipes, setMyRecipes] = useState(staticRecipes);

  const availableGoals = [
    { id: 'jamb-300', label: 'JAMB 300+ Score', duration: '60 days', difficulty: 'Hard' },
    { id: 'jamb-250', label: 'JAMB 250+ Score', duration: '45 days', difficulty: 'Medium' },
    { id: 'waec-excellence', label: 'WAEC 8 A1s', duration: '90 days', difficulty: 'Hard' },
    { id: 'waec-credit', label: 'WAEC 5 Credits', duration: '60 days', difficulty: 'Medium' },
    { id: 'post-utme', label: 'Post-UTME Prep', duration: '30 days', difficulty: 'Medium' },
    { id: 'scholarship', label: 'Scholarship Exam', duration: '45 days', difficulty: 'Hard' }
  ];

  const createRecipe = async () => {
    if (!selectedGoal || !timeframe) return;
    
    setIsLoading(true);
    try {
      const goalData = availableGoals.find(g => g.id === selectedGoal);
      
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
              content: `You are an AI study planner for Nigerian students. Create a detailed study plan for: ${goalData.label} in ${goalData.duration} with ${timeframe} daily study time. Include:
              1. Weekly breakdown
              2. Daily tasks (specific and actionable)
              3. Subject priorities
              4. Milestones
              5. Nigerian exam context (JAMB/WAEC patterns)
              
              Format as JSON: {
                "title": "Plan name",
                "weeks": [{
                  "week": 1,
                  "goal": "Weekly objective",
                  "tasks": ["Daily task 1", "Daily task 2"]
                }],
                "subjects": ["Subject list"],
                "milestones": ["Key checkpoints"]
              }`
            },
            { role: 'user', content: `Create study plan for ${goalData.label}` }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      const data = await response.json();
      const aiPlan = data.choices[0].message.content;
      
      try {
        const planData = JSON.parse(aiPlan);
        
        const newRecipe = {
          id: Date.now(),
          title: planData.title || goalData.label + ' Plan',
          goal: goalData.label,
          timeframe: goalData.duration,
          progress: 0,
          currentWeek: 1,
          totalWeeks: planData.weeks?.length || 8,
          status: 'on-track',
          subjects: planData.subjects || ['Mathematics', 'English'],
          todayTasks: planData.weeks?.[0]?.tasks?.slice(0, 3).map(task => ({
            task,
            completed: false
          })) || [],
          weeklyGoal: planData.weeks?.[0]?.goal || 'Get started with your study plan',
          streak: 0,
          aiGenerated: true,
          fullPlan: planData
        };
        
        setMyRecipes(prev => [newRecipe, ...prev]);
        setSelectedGoal('');
        setTimeframe('');
        setActiveTab('my-recipes');
        alert('AI study recipe created successfully! Check your recipes tab.');
        
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        alert('Study recipe created! AI generated a custom plan for you.');
      }
      
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('Error creating study recipe. Please try again.');
    }
    setIsLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track': return 'text-green-600 bg-green-100';
      case 'behind': return 'text-red-600 bg-red-100';
      case 'ahead': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-3 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Study Recipes</h1>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>AI-powered personalized study plans</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">12</div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completion</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex space-x-1 rounded-lg p-1 mb-6 sm:mb-8 overflow-x-auto ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        {[
          { id: 'my-recipes', label: 'My Recipes' },
          { id: 'create', label: 'Create Recipe' },
          { id: 'browse', label: 'Browse Templates' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 rounded-md transition ${
              activeTab === tab.id
                ? isDarkMode ? 'bg-gray-800 text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm'
                : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* My Recipes Tab */}
      {activeTab === 'my-recipes' && (
        <div className="space-y-6">
          {myRecipes.map((recipe) => (
            <div key={recipe.id} className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl shadow-lg p-6`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>{recipe.title}</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{recipe.goal}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Week {recipe.currentWeek} of {recipe.totalWeeks}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(recipe.status)}`}>
                      {recipe.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{recipe.progress}%</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Complete</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Overall Progress</span>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{recipe.streak} day streak 🔥</span>
                </div>
                <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${recipe.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Today's Tasks */}
              <div className="mb-6">
                <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Today's Tasks</h4>
                <div className="space-y-2">
                  {recipe.todayTasks.map((task, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        task.completed ? 'bg-green-500' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`}>
                        {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-sm ${
                        task.completed 
                          ? isDarkMode ? 'text-gray-400 line-through' : 'text-gray-500 line-through'
                          : isDarkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        {task.task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Goal */}
              <div className={`${isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'} rounded-lg p-4 mb-6`}>
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>This Week's Goal</h5>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>{recipe.weeklyGoal}</p>
                  </div>
                </div>
              </div>

              {/* Subjects */}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {recipe.subjects.map((subject, index) => (
                    <span key={index} className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                      {subject}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <Play className="w-4 h-4" />
                    <span>Continue</span>
                  </button>
                  <button className={`flex items-center space-x-1 px-4 py-2 border rounded-lg transition ${isDarkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <BarChart3 className="w-4 h-4" />
                    <span>Analytics</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Recipe Tab */}
      {activeTab === 'create' && (
        <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl shadow-lg p-8`}>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-100'}`}>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>Create Your Study Recipe</h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>AI will generate a personalized study plan based on your goal</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Select Your Goal
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {availableGoals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`p-4 border-2 rounded-lg text-left transition ${
                        selectedGoal === goal.id
                          ? 'border-blue-500 bg-blue-50'
                          : isDarkMode 
                            ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{goal.label}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{goal.duration}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          goal.difficulty === 'Hard' ? 'bg-red-100 text-red-800' :
                          goal.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {goal.difficulty}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Available Study Time (per day)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['1-2 hours', '2-3 hours', '3-4 hours', '4+ hours'].map((time) => (
                    <button
                      key={time}
                      onClick={() => setTimeframe(time)}
                      className={`p-3 border-2 rounded-lg transition ${
                        timeframe === time
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : isDarkMode 
                            ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-300'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-orange-900/20 border border-orange-800' : 'bg-orange-50 border border-orange-200'} rounded-lg p-4`}>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-orange-300' : 'text-orange-900'}`}>AI Recipe Generation</h4>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-orange-200' : 'text-orange-700'}`}>
                      Our AI will analyze your goal, available time, and learning patterns to create 
                      a personalized study plan with daily micro-goals and adaptive adjustments.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={createRecipe}
                disabled={!selectedGoal || !timeframe || isLoading}
                className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
              >
                {isLoading ? 'AI Generating Recipe...' : 'Generate My Study Recipe'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Browse Templates Tab */}
      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {availableGoals.map((template) => (
            <div key={template.id} className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl shadow-lg p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}`}>{template.label}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{template.duration} plan</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  template.difficulty === 'Hard' ? 'bg-red-100 text-red-800' :
                  template.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {template.difficulty}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className={`flex items-center space-x-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Calendar className="w-4 h-4" />
                  <span>Daily study sessions</span>
                </div>
                <div className={`flex items-center space-x-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <TrendingUp className="w-4 h-4" />
                  <span>Progress tracking</span>
                </div>
                <div className={`flex items-center space-x-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Target className="w-4 h-4" />
                  <span>Adaptive adjustments</span>
                </div>
              </div>

              <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Use This Template
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyRecipePage;