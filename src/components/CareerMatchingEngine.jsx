import React, { useState, useEffect } from 'react';
import { Briefcase, TrendingUp, MapPin, DollarSign, Clock, Users, Star, BookOpen, Loader2 } from 'lucide-react';

const CareerMatchingEngine = ({ assessmentResults, apiKey }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [compareList, setCompareList] = useState([]);

  const careerDatabase = {
    'Software Engineer': {
      category: 'Technology',
      jamb_subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
      universities: ['University of Lagos', 'Obafemi Awolowo University', 'University of Ibadan'],
      entry_requirements: '250+ JAMB score, 5 O\'Level credits including Math and English',
      salary_range: '₦2.5M - ₦15M annually',
      job_market: 'Excellent - High demand, growing tech sector',
      skills_needed: ['Programming', 'Problem-solving', 'Logical thinking'],
      personality_fit: ['analytical', 'technical'],
      difficulty: 'High'
    },
    'Medical Doctor': {
      category: 'Healthcare',
      jamb_subjects: ['Biology', 'Chemistry', 'Physics', 'English'],
      universities: ['University of Ibadan', 'University of Lagos', 'Ahmadu Bello University'],
      entry_requirements: '300+ JAMB score, 5 O\'Level credits including Biology, Chemistry',
      salary_range: '₦3M - ₦20M annually',
      job_market: 'Good - Always in demand, competitive entry',
      skills_needed: ['Empathy', 'Attention to detail', 'Scientific knowledge'],
      personality_fit: ['analytical', 'social'],
      difficulty: 'Very High'
    },
    'Data Scientist': {
      category: 'Technology',
      jamb_subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
      universities: ['University of Lagos', 'Covenant University', 'University of Ibadan'],
      entry_requirements: '270+ JAMB score, Strong mathematics background',
      salary_range: '₦3M - ₦18M annually',
      job_market: 'Excellent - Emerging field with high growth',
      skills_needed: ['Statistics', 'Programming', 'Critical thinking'],
      personality_fit: ['analytical', 'technical'],
      difficulty: 'High'
    },
    'Lawyer': {
      category: 'Legal',
      jamb_subjects: ['English', 'Government', 'Economics', 'Literature'],
      universities: ['University of Lagos', 'University of Ibadan', 'Ahmadu Bello University'],
      entry_requirements: '260+ JAMB score, Excellent English proficiency',
      salary_range: '₦2M - ₦25M annually',
      job_market: 'Good - Competitive but stable demand',
      skills_needed: ['Communication', 'Research', 'Analytical thinking'],
      personality_fit: ['analytical', 'social'],
      difficulty: 'High'
    },
    'Architect': {
      category: 'Design & Construction',
      jamb_subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
      universities: ['Obafemi Awolowo University', 'University of Lagos', 'Ahmadu Bello University'],
      entry_requirements: '250+ JAMB score, Strong spatial reasoning',
      salary_range: '₦2M - ₦12M annually',
      job_market: 'Moderate - Depends on construction industry',
      skills_needed: ['Creativity', 'Technical drawing', 'Project management'],
      personality_fit: ['creative', 'technical'],
      difficulty: 'High'
    },
    'Teacher': {
      category: 'Education',
      jamb_subjects: ['English', 'Mathematics', 'Any two relevant subjects'],
      universities: ['University of Ibadan', 'Ahmadu Bello University', 'University of Nigeria'],
      entry_requirements: '200+ JAMB score, Good communication skills',
      salary_range: '₦1.5M - ₦6M annually',
      job_market: 'Good - Always needed, government and private sectors',
      skills_needed: ['Communication', 'Patience', 'Subject expertise'],
      personality_fit: ['social', 'creative'],
      difficulty: 'Medium'
    },
    'Entrepreneur': {
      category: 'Business',
      jamb_subjects: ['Mathematics', 'Economics', 'English', 'Any business subject'],
      universities: ['Lagos Business School', 'University of Lagos', 'Covenant University'],
      entry_requirements: '220+ JAMB score, Business acumen',
      salary_range: '₦1M - ₦50M+ annually (highly variable)',
      job_market: 'Variable - Depends on business success',
      skills_needed: ['Leadership', 'Risk-taking', 'Innovation'],
      personality_fit: ['business', 'creative'],
      difficulty: 'Very High'
    },
    'Accountant': {
      category: 'Finance',
      jamb_subjects: ['Mathematics', 'Economics', 'English', 'Government'],
      universities: ['University of Lagos', 'Obafemi Awolowo University', 'University of Ibadan'],
      entry_requirements: '240+ JAMB score, Strong mathematics',
      salary_range: '₦2M - ₦10M annually',
      job_market: 'Good - Stable demand across industries',
      skills_needed: ['Attention to detail', 'Numerical skills', 'Ethics'],
      personality_fit: ['analytical', 'business'],
      difficulty: 'Medium'
    },
    'Nurse': {
      category: 'Healthcare',
      jamb_subjects: ['Biology', 'Chemistry', 'Physics', 'English'],
      universities: ['University of Ibadan', 'University of Lagos', 'Obafemi Awolowo University'],
      entry_requirements: '220+ JAMB score, Science background',
      salary_range: '₦1.8M - ₦8M annually',
      job_market: 'Excellent - High demand, opportunities abroad',
      skills_needed: ['Empathy', 'Physical stamina', 'Medical knowledge'],
      personality_fit: ['social', 'analytical'],
      difficulty: 'Medium'
    },
    'Graphic Designer': {
      category: 'Creative Arts',
      jamb_subjects: ['English', 'Fine Arts', 'Mathematics', 'Any other subject'],
      universities: ['University of Lagos', 'Yaba College of Technology', 'Ahmadu Bello University'],
      entry_requirements: '200+ JAMB score, Creative portfolio',
      salary_range: '₦1.5M - ₦8M annually',
      job_market: 'Good - Growing digital economy',
      skills_needed: ['Creativity', 'Software proficiency', 'Visual communication'],
      personality_fit: ['creative', 'technical'],
      difficulty: 'Medium'
    }
  };

  const generateCareerMatches = async () => {
    if (!apiKey || !assessmentResults) {
      // Fallback to basic matching without AI
      generateBasicMatches();
      return;
    }

    setLoading(true);
    try {
      const prompt = `Based on this student assessment, recommend the top 10 career matches for a Nigerian student:

Assessment Results:
- Personality Scores: ${JSON.stringify(assessmentResults.scores)}
- Dominant Type: ${assessmentResults.dominant}
- Academic Interests: Based on answers provided
- Values: Career values and priorities from assessment

For each career recommendation, provide:
1. Career name
2. Match percentage (0-100%)
3. Why it fits their personality and skills
4. Required JAMB subjects
5. Top 3 Nigerian universities for this field
6. Entry requirements (JAMB score, O'Level requirements)
7. Salary range in Nigerian Naira (realistic current market)
8. Job market outlook in Nigeria
9. Skills they need to develop
10. Career progression path (entry → mid → senior level)
11. Pros and cons specific to Nigerian context
12. Day-in-the-life description

Focus on careers available in Nigeria with realistic opportunities. Consider both traditional and emerging fields.

Format as JSON array with these exact fields:
[{
  "career": "Career Name",
  "match_percentage": 85,
  "reasoning": "Why this fits...",
  "jamb_subjects": ["Math", "Physics", "Chemistry", "English"],
  "universities": ["University 1", "University 2", "University 3"],
  "entry_requirements": "Requirements...",
  "salary_range": "₦X - ₦Y annually",
  "job_market": "Market outlook...",
  "skills_needed": ["Skill 1", "Skill 2", "Skill 3"],
  "career_path": "Entry → Mid → Senior progression",
  "pros": ["Pro 1", "Pro 2", "Pro 3"],
  "cons": ["Con 1", "Con 2"],
  "day_in_life": "Typical day description...",
  "difficulty": "Low/Medium/High/Very High"
}]`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate matches');

      const data = await response.json();
      const matchesText = data.choices[0]?.message?.content;
      
      try {
        const aiMatches = JSON.parse(matchesText);
        if (Array.isArray(aiMatches)) {
          setMatches(aiMatches);
        } else {
          throw new Error('Invalid format');
        }
      } catch (parseError) {
        console.error('Failed to parse AI response, using fallback');
        generateBasicMatches();
      }
    } catch (error) {
      console.error('AI matching failed, using fallback:', error);
      generateBasicMatches();
    }
    setLoading(false);
  };

  const generateBasicMatches = () => {
    const { scores, dominant } = assessmentResults;
    
    const careerMatches = Object.entries(careerDatabase).map(([career, data]) => {
      let matchScore = 0;
      
      // Personality fit scoring
      data.personality_fit.forEach(fit => {
        if (scores[fit]) {
          matchScore += scores[fit] * 0.4; // 40% weight for personality
        }
      });
      
      // Dominant type bonus
      if (data.personality_fit.includes(dominant)) {
        matchScore += 20; // Bonus for dominant type match
      }
      
      // Normalize to percentage
      matchScore = Math.min(95, Math.max(40, Math.round(matchScore)));
      
      return {
        career,
        match_percentage: matchScore,
        reasoning: `Strong fit for ${dominant} personality type with ${data.personality_fit.join(' and ')} characteristics.`,
        jamb_subjects: data.jamb_subjects,
        universities: data.universities,
        entry_requirements: data.entry_requirements,
        salary_range: data.salary_range,
        job_market: data.job_market,
        skills_needed: data.skills_needed,
        career_path: 'Entry Level → Mid Level → Senior Level → Leadership',
        pros: ['Good career prospects', 'Matches your personality', 'Available in Nigeria'],
        cons: ['Competitive field', 'Requires dedication'],
        day_in_life: `A typical day involves working with ${data.skills_needed.join(', ').toLowerCase()} in a ${data.category.toLowerCase()} environment.`,
        difficulty: data.difficulty,
        category: data.category
      };
    }).sort((a, b) => b.match_percentage - a.match_percentage);
    
    setMatches(careerMatches);
  };

  useEffect(() => {
    if (assessmentResults) {
      generateCareerMatches();
    }
  }, [assessmentResults, apiKey]);

  const addToCompare = (career) => {
    if (compareList.length < 3 && !compareList.find(c => c.career === career.career)) {
      setCompareList([...compareList, career]);
    }
  };

  const removeFromCompare = (careerName) => {
    setCompareList(compareList.filter(c => c.career !== careerName));
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-orange-100 text-orange-800',
      'Very High': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || colors['Medium'];
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <Loader2 className="w-16 h-16 mx-auto text-indigo-600 animate-spin mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Your Profile</h2>
          <p className="text-gray-600 mb-4">
            Our AI is matching you with the perfect careers based on your assessment...
          </p>
          <div className="bg-indigo-50 rounded-lg p-4">
            <p className="text-sm text-indigo-700">
              Analyzing personality traits, skills, and Nigerian job market data
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCareer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSelectedCareer(null)}
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                ← Back to Matches
              </button>
              <div className="flex items-center gap-2">
                <div className={`text-2xl font-bold ${getMatchColor(selectedCareer.match_percentage)}`}>
                  {selectedCareer.match_percentage}%
                </div>
                <span className="text-gray-500">Match</span>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{selectedCareer.career}</h1>
              <p className="text-xl text-gray-600">{selectedCareer.reasoning}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Education Requirements
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>JAMB Subjects:</strong> {selectedCareer.jamb_subjects.join(', ')}</div>
                    <div><strong>Entry Requirements:</strong> {selectedCareer.entry_requirements}</div>
                    <div><strong>Top Universities:</strong></div>
                    <ul className="list-disc list-inside ml-4">
                      {selectedCareer.universities.map((uni, index) => (
                        <li key={index}>{uni}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Career Prospects
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Salary Range:</strong> {selectedCareer.salary_range}</div>
                    <div><strong>Job Market:</strong> {selectedCareer.job_market}</div>
                    <div><strong>Career Path:</strong> {selectedCareer.career_path}</div>
                    <div className="flex items-center gap-2">
                      <strong>Difficulty:</strong>
                      <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(selectedCareer.difficulty)}`}>
                        {selectedCareer.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-indigo-50 rounded-xl p-6">
                  <h3 className="font-bold text-indigo-800 mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Skills Needed
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCareer.skills_needed.map((skill, index) => (
                      <span key={index} className="bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-50 rounded-xl p-6">
                  <h3 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Day in the Life
                  </h3>
                  <p className="text-sm text-orange-700">{selectedCareer.day_in_life}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Pros</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      {selectedCareer.pros.map((pro, index) => (
                        <li key={index}>• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Cons</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {selectedCareer.cons.map((con, index) => (
                        <li key={index}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => addToCompare(selectedCareer)}
                disabled={compareList.length >= 3 || compareList.find(c => c.career === selectedCareer.career)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Add to Compare
              </button>
              <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition">
                Select This Path
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-full flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Your Career Matches</h1>
              <p className="text-gray-600">AI-powered recommendations based on your assessment</p>
            </div>
          </div>

          {/* Assessment Summary */}
          <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-3">Your Profile Summary</h3>
            <div className="grid md:grid-cols-5 gap-4 text-sm">
              {Object.entries(assessmentResults.scores).map(([type, score]) => (
                <div key={type} className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{score}%</div>
                  <div className="text-gray-600 capitalize">{type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compare Panel */}
        {compareList.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Compare Careers ({compareList.length}/3)</h3>
              <button
                onClick={() => setCompareList([])}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {compareList.map((career) => (
                <div key={career.career} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{career.career}</h4>
                    <button
                      onClick={() => removeFromCompare(career.career)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>Match: <span className={`font-bold ${getMatchColor(career.match_percentage)}`}>{career.match_percentage}%</span></div>
                    <div>Salary: {career.salary_range}</div>
                    <div>Difficulty: <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(career.difficulty)}`}>{career.difficulty}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Career Matches */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match, index) => (
            <div key={match.career} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                <div className={`text-2xl font-bold ${getMatchColor(match.match_percentage)}`}>
                  {match.match_percentage}%
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">{match.career}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{match.reasoning}</p>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span>{match.salary_range}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="line-clamp-1">{match.job_market}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(match.difficulty)}`}>
                    {match.difficulty}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCareer(match)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-semibold transition"
                >
                  Explore
                </button>
                <button
                  onClick={() => addToCompare(match)}
                  disabled={compareList.length >= 3 || compareList.find(c => c.career === match.career)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Compare
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerMatchingEngine;