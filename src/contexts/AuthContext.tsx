
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
  register: (userData: { username: string, password: string, name: string, role: UserRole }) => Promise<boolean>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  updateUserProfile: () => {},
  register: async () => false,
});

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('gym-app-user', null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing user on initial load
  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsLoading(true);
        
        // Only proceed if we have a user in local storage to validate
        if (user?.id) {
          // Use a simplified query to avoid RLS recursion issues
          const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('id', user.id)
            .single();
          
          if (error || !data) {
            console.log('User validation failed, logging out');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error in auth check:', error);
        // Fail safe by clearing user data
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check if username exists and password matches
      const { data, error } = await supabase
        .from('users')
        .select('id, username, role, name, password')
        .eq('username', username)
        .maybeSingle();
      
      if (error) {
        console.error('Login query error:', error);
        return false;
      }
      
      if (data && data.password === password) {
        const userData: User = {
          id: data.id,
          username: data.username,
          role: data.role as UserRole,
          name: data.name
        };
        
        setUser(userData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function for trainers
  const register = async (userData: { 
    username: string, 
    password: string, 
    name: string, 
    role: UserRole 
  }): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check if username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('username', userData.username)
        .maybeSingle();
      
      if (checkError) {
        console.error('Username check error:', checkError);
        return false;
      }
      
      if (existingUser) {
        toast({
          title: "Registration failed",
          description: "Username already exists.",
          variant: "destructive"
        });
        return false;
      }
      
      // Insert new user
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            username: userData.username,
            password: userData.password,
            name: userData.name,
            role: userData.role
          }
        ])
        .select('id, username, role, name')
        .single();
      
      if (error) {
        console.error('Registration error:', error);
        return false;
      }
      
      toast({
        title: "Registration successful",
        description: `${userData.name} has been registered as a ${userData.role}.`,
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
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
      
      // Update user in database
      supabase
        .from('users')
        .update({
          username: updatedUser.username,
          name: updatedUser.name,
          role: updatedUser.role
        })
        .eq('id', user.id)
        .then(({ error }) => {
          if (error) {
            console.error('Error updating user:', error);
            toast({
              title: "Update failed",
              description: "Failed to update profile.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Profile updated",
              description: "Your profile has been successfully updated.",
            });
          }
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
        updateUserProfile,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
