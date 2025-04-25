import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Reminders from './pages/Reminders';
import AiChat from './pages/AiChat';
import SocialActivities from './pages/SocialActivities';
import GroupChat from './pages/GroupChat';
import EmergencyContacts from './pages/EmergencyContacts';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
          <Route path="/ai-chat" element={<ProtectedRoute><AiChat /></ProtectedRoute>} />
          <Route path="/social-activities" element={<ProtectedRoute><SocialActivities /></ProtectedRoute>} />
          <Route path="/group-chat" element={<ProtectedRoute><GroupChat /></ProtectedRoute>} />
          <Route path="/emergency-contacts" element={<ProtectedRoute><EmergencyContacts /></ProtectedRoute>} />

          {/* 404 Route */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
