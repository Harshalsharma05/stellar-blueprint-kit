
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthContextType } from '@/types';
import { authService } from '@/lib/auth';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = authService.getStoredToken();
      if (token) {
        const userData = await authService.getUserFromToken(token);
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      authService.removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string) => {
    try {
      setIsLoading(true);
      authService.storeToken(token);
      const userData = await authService.getUserFromToken(token);
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.removeToken();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
