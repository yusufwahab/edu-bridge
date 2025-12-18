const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  register: (userData) => apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  login: (credentials) => apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  getProfile: () => apiRequest('/api/user/me'),
  
  updateProfile: (profileData) => apiRequest('/api/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  })
};

// Onboarding API
export const onboardingAPI = {
  complete: (onboardingData) => apiRequest('/api/onboarding/complete', {
    method: 'POST',
    body: JSON.stringify(onboardingData)
  }),
  
  getData: () => apiRequest('/api/onboarding/data'),
  
  update: (updateData) => apiRequest('/api/onboarding/update', {
    method: 'PUT',
    body: JSON.stringify(updateData)
  })
};

// Study Pacts API
export const pactsAPI = {
  getAll: () => apiRequest('/api/pacts'),
  
  create: (pactData) => apiRequest('/api/pacts', {
    method: 'POST',
    body: JSON.stringify(pactData)
  }),
  
  update: (id, pactData) => apiRequest(`/api/pacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(pactData)
  }),
  
  delete: (id) => apiRequest(`/api/pacts/${id}`, {
    method: 'DELETE'
  }),
  
  complete: (id, completionData) => apiRequest(`/api/pacts/${id}/complete`, {
    method: 'PUT',
    body: JSON.stringify(completionData)
  }),
  
  share: (id, email) => apiRequest(`/api/pacts/${id}/share`, {
    method: 'POST',
    body: JSON.stringify({ email })
  }),
  
  start: (id) => apiRequest(`/api/pacts/${id}/start`, {
    method: 'PUT'
  }),
  
  join: (id) => apiRequest(`/api/pacts/${id}/join`, {
    method: 'POST'
  }),
  
  leave: (id) => apiRequest(`/api/pacts/${id}/leave`, {
    method: 'POST'
  }),
  
  getAnalytics: () => apiRequest('/api/pacts/analytics'),
  
  getHistory: () => apiRequest('/api/pacts/history'),
  
  getFriends: () => apiRequest('/api/pacts/friends'),
  
  invite: (id, emails) => apiRequest(`/api/pacts/${id}/invite`, {
    method: 'POST',
    body: JSON.stringify({ emails })
  })
};

// CBT Practice API
export const cbtAPI = {
  submitResult: (resultData) => apiRequest('/api/cbt/results', {
    method: 'POST',
    body: JSON.stringify(resultData)
  }),
  
  getHistory: () => apiRequest('/api/cbt/history'),
  
  getAnalytics: () => apiRequest('/api/cbt/analytics')
};

// Activity Tracking API
export const activityAPI = {
  track: (activityData) => apiRequest('/api/activity/track', {
    method: 'POST',
    body: JSON.stringify(activityData)
  }),
  
  getStreak: () => apiRequest('/api/activity/streak')
};

// Learning Progress API
export const learningAPI = {
  recordProgress: (progressData) => apiRequest('/api/learning/progress', {
    method: 'POST',
    body: JSON.stringify(progressData)
  }),
  
  getAnalytics: () => apiRequest('/api/learning/analytics'),
  
  getRecommendations: () => apiRequest('/api/learning/recommendations'),
  
  recordSession: (sessionData) => apiRequest('/api/study/session', {
    method: 'POST',
    body: JSON.stringify(sessionData)
  }),
  
  getStatistics: () => apiRequest('/api/study/statistics')
};

// Settings API
export const settingsAPI = {
  getAll: () => apiRequest('/api/settings'),
  
  updateProfile: (profileData) => apiRequest('/api/settings/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  }),
  
  updateClass: (classData) => apiRequest('/api/settings/class', {
    method: 'PUT',
    body: JSON.stringify(classData)
  }),
  
  updateNotifications: (notificationData) => apiRequest('/api/settings/notifications', {
    method: 'PUT',
    body: JSON.stringify(notificationData)
  }),
  
  updatePreferences: (preferencesData) => apiRequest('/api/settings/preferences', {
    method: 'PUT',
    body: JSON.stringify(preferencesData)
  })
};

// Dashboard API
export const dashboardAPI = {
  getOverview: () => apiRequest('/api/dashboard/overview'),
  
  getRecentActivity: () => apiRequest('/api/dashboard/recent-activity'),
  
  getStudyStats: () => apiRequest('/api/dashboard/study-stats'),
  
  getUpcomingPacts: () => apiRequest('/api/dashboard/upcoming-pacts'),
  
  getQuickStats: () => apiRequest('/api/dashboard/quick-stats'),
  
  createQuickPact: (pactData) => apiRequest('/api/dashboard/quick-pact', {
    method: 'POST',
    body: JSON.stringify(pactData)
  })
};

// Verification API
export const verificationAPI = {
  sendOTP: (email) => apiRequest('/api/verification/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),
  
  verifyOTP: (email, otp) => apiRequest('/api/verification/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp })
  })
};

// GROQ API Key
export const groqAPI = {
  getKey: () => apiRequest('/api/key')
};