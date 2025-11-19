import TranslatePage from "./TranslatePage";
import LandingPage from "./LandingPage";
import Login from "./Login";
import Signup from "./Signup";
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/dashboard" element={<TranslatePage />} />
      </Routes>
    </BrowserRouter>
  )
}