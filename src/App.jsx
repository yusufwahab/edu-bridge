import TranslatePage from "./TranslatePage";
import LandingPage from "./LandingPage";
import Login from "./Login";
import Signup from "./Signup";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import StudyBuddyPage from "./components/StudyBuddyPage";
import StudyPactsPage from "./components/StudyPactsPage";
import ExamPredictionDashboard from "./components/ExamPredictionDashboard";
import CareerCompassPage from "./components/CareerCompassPage";
import CBTPracticePage from "./components/CBTPracticePage";
import CollaborativeLearningPage from "./components/CollaborativeLearningPage";
import PeerTeachPage from "./components/PeerTeachPage";
import StudyMarketplacePage from "./components/StudyMarketplacePage";
import StudyRecipePage from "./components/StudyRecipePage";
import ActivityFeedPage from "./components/ActivityFeedPage";
import OnboardingWelcome from "./components/OnboardingWelcome";
import OnboardingLearningStyle from "./components/OnboardingLearningStyle";
import OnboardingCareerAssessment from "./components/OnboardingCareerAssessment";
import OnboardingFirstPact from "./components/OnboardingFirstPact";
import LearningPage from "./components/LearningPage";
import SettingsPage from "./components/SettingsPage";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import axios from 'axios';


export default function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const BASE_URL = 'https://edubridge-backend-thgw.onrender.com';

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`${BASE_URL}/api/user/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setUser(response.data);
        } catch (err) {
          setError('Failed to fetch user data');
          localStorage.removeItem('token');
          console.error(err);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        
        {/* Onboarding Flow */}
        <Route path="/onboarding/welcome" element={<OnboardingWelcome />} />
        <Route path="/onboarding/learning-style" element={<OnboardingLearningStyle />} />
        <Route path="/onboarding/career-assessment" element={<OnboardingCareerAssessment />} />
        <Route path="/onboarding/first-pact" element={<OnboardingFirstPact />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/study-buddy" element={<Layout><StudyBuddyPage /></Layout>} />
        <Route path="/study-pacts" element={<Layout><StudyPactsPage /></Layout>} />
        <Route path="/exam-predictions" element={<Layout><ExamPredictionDashboard /></Layout>} />
        <Route path="/career-compass" element={<Layout><CareerCompassPage /></Layout>} />
        <Route path="/learning" element={<Layout><LearningPage /></Layout>} />
        <Route path="/cbt-practice" element={<Layout><CBTPracticePage /></Layout>} />
        <Route path="/collaborative-learning" element={<Layout><CollaborativeLearningPage /></Layout>} />
        <Route path="/peer-teach" element={<Layout><PeerTeachPage /></Layout>} />
        <Route path="/study-marketplace" element={<Layout><StudyMarketplacePage /></Layout>} />
        <Route path="/study-recipes" element={<Layout><StudyRecipePage /></Layout>} />
        <Route path="/peer-teach" element={<Layout><PeerTeachPage /></Layout>} />
        <Route path="/activity-feed" element={<Layout><ActivityFeedPage /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}