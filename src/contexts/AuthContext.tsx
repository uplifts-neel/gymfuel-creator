
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define user roles
export type UserRole = 'owner' | 'trainer' | 'member';

// Define user interface
export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

// Define context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  updateUserProfile: () => {},
});

// Initial owner account
const INITIAL_OWNER: User = {
  id: 'owner-1',
  username: 'the gym',
  role: 'owner',
  name: 'Dronacharya Gym Owner'
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('gym-app-user', null);
  const [isLoading, setIsLoading] = useState(true);
  const [credentials] = useLocalStorage<Record<string, string>>('gym-app-credentials', {
    'the gym': 'surender9818', // Default owner credentials
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing user on initial load
  useEffect(() => {
    // Set loading to false after checking for user
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check if username exists and password matches
      if (credentials[username] && credentials[username] === password) {
        // For the owner account
        if (username === 'the gym') {
          setUser(INITIAL_OWNER);
          toast({
            title: "Login successful",
            description: "Welcome back, Gym Owner!",
          });
          return true;
        } 
        
        // For other accounts (not implemented yet)
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        return true;
      }
      
      toast({
        title: "Login failed",
        description: "Invalid username or password.",
        variant: "destructive"
      });
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  // Update user profile
  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        login, 
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
