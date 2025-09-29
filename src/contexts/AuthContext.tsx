import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'farmer' | 'veterinarian' | 'regulator';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  farmId?: string;
  practiceId?: string;
  region?: string;
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, otp: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('farmUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, otp: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate OTP verification (in real app, this would call backend)
    if (otp === '1234') {
      const newUser: User = {
        id: `${role}_${Date.now()}`,
        name: role === 'farmer' ? 'Rajesh Kumar' : role === 'veterinarian' ? 'Dr. Priya Sharma' : 'Inspector Singh',
        phone,
        role,
        farmId: role === 'farmer' ? 'FARM001' : undefined,
        practiceId: role === 'veterinarian' ? 'VET001' : undefined,
        region: role === 'regulator' ? 'Punjab' : undefined,
      };
      
      setUser(newUser);
      localStorage.setItem('farmUser', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('farmUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};