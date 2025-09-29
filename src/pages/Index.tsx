import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import Login from '@/pages/Login';
import FarmerDashboard from '@/pages/FarmerDashboard';
import VeterinarianDashboard from '@/pages/VeterinarianDashboard';
import RegulatorDashboard from '@/pages/RegulatorDashboard';

const Index = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      {user?.role === 'farmer' && <FarmerDashboard />}
      {user?.role === 'veterinarian' && <VeterinarianDashboard />}
      {user?.role === 'regulator' && <RegulatorDashboard />}
    </Layout>
  );
};

export default Index;
