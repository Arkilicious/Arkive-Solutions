
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpenIcon } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-uniwise-light">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <BookOpenIcon size={48} className="text-uniwise-blue mr-3" />
          <h1 className="text-4xl font-bold text-uniwise-blue">UniWise</h1>
        </div>
        <p className="text-xl text-gray-600 animate-pulse-slow">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
