/**
 * Componente Principal - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/App.js
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import GuestPortal from './pages/GuestPortal';
import StaffDashboard from './pages/StaffDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import './styles/globals.css';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route 
                  path="/guest" 
                  element={
                    <ProtectedRoute allowedRoles={['guest']}>
                      <GuestPortal />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/staff" 
                  element={
                    <ProtectedRoute allowedRoles={['receptionist', 'cleaning', 'manager']}>
                      <StaffDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route
                  path="/manager"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'manager']}>
                      <ManagerDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;