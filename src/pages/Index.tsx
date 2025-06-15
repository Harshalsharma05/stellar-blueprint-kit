import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Landing from './Landing';

const Index = () => {
  const { user } = useAuth();

  // If user is authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, show the landing page
  return <Landing />;
};

export default Index;
