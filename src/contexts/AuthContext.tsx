
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for our demo
const mockUser: User = {
  id: "user-001",
  name: "John Smith",
  email: "john.smith@university.edu",
  faculty: "Science and Technology",
  department: "Computer Science",
  level: "300",
  courses: ["CSC301", "CSC303", "CSC307", "GSS301"],
  isSubscribed: false,
  createdAt: new Date().toISOString()
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would check for existing session here
    // For this demo, we're simulating loading
    const timer = setTimeout(() => {
      // Uncomment to start with logged in user
      // setUser(mockUser);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would make an API call
      // For demo, we're just setting the mock user
      await new Promise(resolve => setTimeout(resolve, 800));
      setUser(mockUser);
      localStorage.setItem('uniwise-user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: Partial<User>, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name || "",
        email: userData.email || "",
        faculty: userData.faculty || "",
        department: userData.department || "",
        level: userData.level || "",
        courses: userData.courses || [],
        isSubscribed: false,
        createdAt: new Date().toISOString()
      };
      setUser(newUser);
      localStorage.setItem('uniwise-user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Signup failed:', error);
      throw new Error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('uniwise-user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
