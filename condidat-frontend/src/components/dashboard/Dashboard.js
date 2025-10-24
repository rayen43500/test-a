import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import CandidatDashboard from './CandidatDashboard';
import RecruteurDashboard from './RecruteurDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Candidat':
        return <CandidatDashboard />;
      case 'Recruteur':
        return <RecruteurDashboard />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Welcome!</h2>
            <p className="mt-2 text-gray-600">Your dashboard is being prepared...</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.fullname}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {user?.role} Dashboard
        </p>
      </div>
      
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
