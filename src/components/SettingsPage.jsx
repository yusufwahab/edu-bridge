import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, User, Bell, Shield, Globe, Palette, Volume2, Eye, GraduationCap } from 'lucide-react';

const SettingsPage = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [settings, setSettings] = useState({
    notifications: {
      studyReminders: true,
      pactUpdates: true,
      achievements: true,
      weeklyReports: false
    },
    privacy: {
      profileVisibility: 'friends',
      studyDataSharing: true,
      analyticsOptIn: false
    },
    preferences: {
      language: 'en',
      timezone: 'Africa/Lagos',
      studyGoalReminders: true,
      soundEffects: true
    }
  });

  const [classData, setClassData] = useState({
    gradeLevel: 'SS 3',
    examTarget: 'JAMB',
    university: '',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English Language']
  });

  const [isEditingClass, setIsEditingClass] = useState(false);

  const gradeOptions = [
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
    'JSS 1', 'JSS 2', 'JSS 3',
    'SS 1', 'SS 2', 'SS 3',
    '100 Level', '200 Level'
  ];

  const subjectOptions = [
    'English Language', 'Mathematics', 'Basic Science', 'Basic Technology',
    'Social Studies', 'Civic Education', 'Christian Religious Studies', 'Islamic Religious Studies',
    'Home Economics', 'Physical and Health Education', 'Cultural and Creative Arts',
    'Physics', 'Chemistry', 'Biology', 'Further Mathematics',
    'Literature in English', 'Government', 'Economics', 'Commerce',
    'Geography', 'History', 'Agricultural Science', 'Computer Science',
    'Technical Drawing', 'Food and Nutrition', 'French', 'Yoruba', 'Igbo', 'Hausa'
  ];

  const getExamOptions = () => {
    const grade = classData.gradeLevel;
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

  const handleSubjectToggle = (subject) => {
    setClassData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleEndClass = () => {
    if (confirm('Are you sure you want to end your current class? This will reset your progress.')) {
      setIsEditingClass(true);
      setClassData({ gradeLevel: '', examTarget: '', university: '', subjects: [] });
    }
  };

  const handleSaveClass = () => {
    if (classData.gradeLevel && classData.examTarget && classData.subjects.length >= 4) {
      if (classData.examTarget === 'POST-UTME' && !classData.university) {
        alert('Please select a university for POST-UTME.');
        return;
      }
      setIsEditingClass(false);
      alert('Class and subjects updated successfully!');
    } else {
      alert('Please select a grade level, target exam, and at least 4 subjects.');
    }
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled 
          ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
          : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${
          isDarkMode 
            ? 'text-white' 
            : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'
        }`}>Settings</h1>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Customize your YabvilPrep experience</p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                  </p>
                </div>
              </div>
              <ToggleSwitch enabled={isDarkMode} onChange={toggleDarkMode} />
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  defaultValue="Adebayo Johnson"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="adebayo@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                School
              </label>
              <input
                type="text"
                defaultValue="Lagos State University"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
          </div>

          <div className="space-y-4">
            {Object.entries({
              studyReminders: 'Study session reminders',
              pactUpdates: 'Study pact updates',
              achievements: 'Achievement notifications',
              weeklyReports: 'Weekly progress reports'
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get notified about {label.toLowerCase()}
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.notifications[key]}
                  onChange={(value) => updateSetting('notifications', key, value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy & Security</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Visibility
              </label>
              <select
                value={settings.privacy.profileVisibility}
                onChange={(e) => updateSetting('privacy', 'profileVisibility', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Study Data Sharing</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Share anonymous study data to improve the platform
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.privacy.studyDataSharing}
                onChange={(value) => updateSetting('privacy', 'studyDataSharing', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Analytics Opt-in</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Help us improve by sharing usage analytics
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.privacy.analyticsOptIn}
                onChange={(value) => updateSetting('privacy', 'analyticsOptIn', value)}
              />
            </div>
          </div>
        </div>

        {/* Class & Subjects */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Class & Subjects</h2>
          </div>

          <div className="space-y-4">
            {!isEditingClass ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Grade Level
                    </label>
                    <div className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      {classData.gradeLevel}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Exam
                    </label>
                    <div className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      {classData.examTarget}
                    </div>
                  </div>
                </div>

                {classData.university && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target University
                    </label>
                    <div className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      {classData.university}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Subjects ({classData.subjects.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {classData.subjects.map(subject => (
                      <span key={subject} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsEditingClass(true)}
                    className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                  >
                    Change Class/Subjects
                  </button>
                  <button
                    onClick={handleEndClass}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                  >
                    End Current Class
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select New Grade Level
                  </label>
                  <select
                    value={classData.gradeLevel}
                    onChange={(e) => setClassData(prev => ({ ...prev, gradeLevel: e.target.value, examTarget: '', university: '' }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select grade level</option>
                    {gradeOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                {classData.gradeLevel && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Exam
                    </label>
                    <select
                      value={classData.examTarget}
                      onChange={(e) => setClassData(prev => ({ ...prev, examTarget: e.target.value, university: '' }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select exam</option>
                      {getExamOptions().map(exam => (
                        <option key={exam} value={exam}>{exam}</option>
                      ))}
                    </select>
                  </div>
                )}

                {classData.examTarget === 'POST-UTME' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select University
                    </label>
                    <select
                      value={classData.university}
                      onChange={(e) => setClassData(prev => ({ ...prev, university: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select university</option>
                      {nigerianUniversities.map(uni => (
                        <option key={uni} value={uni}>{uni}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Subjects (Choose at least 4)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700">
                    {subjectOptions.map(subject => (
                      <label key={subject} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={classData.subjects.includes(subject)}
                          onChange={() => handleSubjectToggle(subject)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{subject}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Selected: {classData.subjects.length} subjects
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsEditingClass(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveClass}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => updateSetting('preferences', 'language', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="yo">Yoruba</option>
                  <option value="ig">Igbo</option>
                  <option value="ha">Hausa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.preferences.timezone}
                  onChange={(e) => updateSetting('preferences', 'timezone', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Africa/Lagos">Lagos (WAT)</option>
                  <option value="Africa/Abuja">Abuja (WAT)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Sound Effects</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Play sounds for notifications and interactions
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.preferences.soundEffects}
                onChange={(value) => updateSetting('preferences', 'soundEffects', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Study Goal Reminders</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get reminded about your daily study goals
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.preferences.studyGoalReminders}
                onChange={(value) => updateSetting('preferences', 'studyGoalReminders', value)}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          <button className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">
            Reset to Defaults
          </button>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;