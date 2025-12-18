import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onboardingAPI } from '../utils/api';

const OnboardingWelcome = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gradeLevel: '',
    examTarget: '',
    university: '',
    examDate: '',
    subjects: [],
    phoneNumber: '',
    stateOfOrigin: '',
    school: ''
  });

  const gradeOptions = [
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
    'JSS 1', 'JSS 2', 'JSS 3',
    'SS 1', 'SS 2', 'SS 3',
    '100 Level', '200 Level'
  ];

  const getExamOptions = () => {
    const grade = formData.gradeLevel;
    if (grade.startsWith('Primary')) return ['NCEE', 'Common Entrance'];
    if (grade.startsWith('JSS')) return ['BECE', 'JSCE'];
    if (grade.startsWith('SS')) return ['WAEC', 'NECO', 'JAMB', 'NABTEB', 'GCE', 'JUPEB', 'POST-UTME'];
    if (grade.includes('Level')) return ['POST-UTME', 'JUPEB'];
    return [];
  };

  const nigerianUniversities = [
    'University of Lagos (UNILAG)', 'University of Ibadan (UI)', 'Obafemi Awolowo University (OAU)',
    'University of Nigeria, Nsukka (UNN)', 'Ahmadu Bello University (ABU)', 'University of Benin (UNIBEN)',
    'Lagos State University (LASU)', 'Covenant University', 'Babcock University',
    'Federal University of Technology, Akure (FUTA)', 'University of Ilorin (UNILORIN)',
    'Nnamdi Azikiwe University (UNIZIK)', 'University of Port Harcourt (UNIPORT)',
    'Bayero University Kano (BUK)', 'University of Jos (UNIJOS)', 'Rivers State University',
    'Ekiti State University (EKSU)', 'Osun State University (UNIOSUN)', 'Delta State University (DELSU)',
    'Federal University, Oye-Ekiti (FUOYE)', 'Pan-Atlantic University', 'Afe Babalola University',
    'Landmark University', 'Redeemer\'s University', 'Bowen University'
  ];
  const subjectOptions = [
    // Primary School Subjects
    'English Language', 'Mathematics', 'Basic Science', 'Basic Technology',
    'Social Studies', 'Civic Education', 'Christian Religious Studies', 'Islamic Religious Studies',
    'Home Economics', 'Physical and Health Education', 'Cultural and Creative Arts',
    // Secondary School Subjects
    'Physics', 'Chemistry', 'Biology', 'Further Mathematics',
    'Literature in English', 'Government', 'Economics', 'Commerce',
    'Geography', 'History', 'Agricultural Science', 'Computer Science',
    'Technical Drawing', 'Food and Nutrition', 'French', 'Yoruba', 'Igbo', 'Hausa'
  ];
  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
    'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
    'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
    'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  const handleSubjectToggle = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleNext = () => {
    localStorage.setItem('onboardingData', JSON.stringify(formData));
    navigate('/onboarding/learning-style');
  };

  const handleSkip = async () => {
    try {
      // Save minimal onboarding data
      await onboardingAPI.complete({
        gradeLevel: 'SS 3',
        examTarget: 'JAMB',
        subjects: ['Mathematics', 'English Language', 'Physics', 'Chemistry'],
        phoneNumber: '',
        stateOfOrigin: 'Lagos'
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      navigate('/dashboard');
    }
  };

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
            <span className="text-sm font-medium text-gray-300">Step 1 of 4</span>
            <button onClick={handleSkip} className="text-sm text-gray-400 hover:text-white transition-colors">
              Skip for now
            </button>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full w-1/4 shadow-lg"></div>
          </div>
        </div>

        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Classence!</h1>
          <p className="text-gray-300 text-lg">Let's set up your personalized learning journey</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Grade Level</label>
            <select
              value={formData.gradeLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, gradeLevel: e.target.value, examTarget: '', university: '' }))}
              className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            >
              <option value="" className="bg-gray-900">Select grade</option>
              {gradeOptions.map(grade => (
                <option key={grade} value={grade} className="bg-gray-900">{grade}</option>
              ))}
            </select>
          </div>

          {formData.gradeLevel && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Target Exam</label>
              <select
                value={formData.examTarget}
                onChange={(e) => setFormData(prev => ({ ...prev, examTarget: e.target.value, university: '' }))}
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              >
                <option value="" className="bg-gray-900">Select exam</option>
                {getExamOptions().map(exam => (
                  <option key={exam} value={exam} className="bg-gray-900">{exam}</option>
                ))}
              </select>
            </div>
          )}

          {formData.examTarget === 'POST-UTME' && (
            <div className="bg-purple-500/10 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/20">
              <label className="block text-sm font-medium text-gray-300 mb-2">Select University</label>
              <select
                value={formData.university}
                onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              >
                <option value="" className="bg-gray-900">Select university</option>
                {nigerianUniversities.map(uni => (
                  <option key={uni} value={uni} className="bg-gray-900">{uni}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Exam Date (Optional)</label>
            <input
              type="date"
              value={formData.examDate}
              onChange={(e) => setFormData(prev => ({ ...prev, examDate: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>

          <div className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/20">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Your Subjects (Choose 4-9)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto bg-white/5 border border-white/20 rounded-xl p-3">
              {subjectOptions.map(subject => (
                <label key={subject} className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 p-1 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.subjects.includes(subject)}
                    onChange={() => handleSubjectToggle(subject)}
                    className="rounded border-white/30 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-300">{subject}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Selected: {formData.subjects.length} subjects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                placeholder="08012345678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">State of Origin</label>
              <select
                value={formData.stateOfOrigin}
                onChange={(e) => setFormData(prev => ({ ...prev, stateOfOrigin: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              >
                <option value="" className="bg-gray-900">Select state</option>
                {nigerianStates.map(state => (
                  <option key={state} value={state} className="bg-gray-900">{state}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">School Name</label>
            <input
              type="text"
              value={formData.school}
              onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              placeholder="Enter your school name"
            />
          </div>
        </div>

        {/* Next Button */}
        <div className="mt-8">
          <button
            onClick={handleNext}
            disabled={!formData.gradeLevel || formData.subjects.length < 4}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-2xl"
          >
            Continue to Learning Style Detection
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default OnboardingWelcome;