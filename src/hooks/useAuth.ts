import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { User, LoginForm, RegisterForm, UserRole, ExperienceLevel } from '../types';
import { storage } from '../utils/helpers';

// Auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginForm) => Promise<void>;
  register: (data: RegisterForm) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Mock user data for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    username: 'johnmusic',
    displayName: 'John Musician',
    avatar: 'https://picsum.photos/seed/user1/200/200',
    bio: 'Passionate musician and producer',
    location: 'Los Angeles, CA',
    website: 'https://johnmusic.com',
    skills: ['Guitar', 'Piano', 'Production'],
    genres: ['Rock', 'Pop', 'Electronic'],
    instruments: ['Guitar', 'Electric Guitar', 'Piano', 'Synthesizer'],
    role: UserRole.MUSICIAN,
    experience: ExperienceLevel.ADVANCED,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '2',
    email: 'sarah@example.com',
    username: 'sarahproducer',
    displayName: 'Sarah Producer',
    avatar: 'https://picsum.photos/seed/user2/200/200',
    bio: 'Electronic music producer and sound engineer',
    location: 'New York, NY',
    website: 'https://sarahproducer.com',
    skills: ['Production', 'Mixing', 'Mastering', 'Sound Design'],
    genres: ['Electronic', 'House', 'Techno', 'Ambient'],
    instruments: ['Synthesizer', 'Drum Machine', 'Audio Interface'],
    role: UserRole.PRODUCER,
    experience: ExperienceLevel.PROFESSIONAL,
    createdAt: new Date('2022-03-20'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    email: 'mike@example.com',
    username: 'mikecomposer',
    displayName: 'Mike Composer',
    avatar: 'https://picsum.photos/seed/user3/200/200',
    bio: 'Classical and film composer',
    location: 'London, UK',
    website: 'https://mikecomposer.com',
    skills: ['Composition', 'Arrangement', 'Orchestration'],
    genres: ['Classical', 'Film Score', 'Ambient'],
    instruments: ['Piano', 'Violin', 'Cello'],
    role: UserRole.COMPOSER,
    experience: ExperienceLevel.PROFESSIONAL,
    createdAt: new Date('2021-06-10'),
    updatedAt: new Date('2024-01-08')
  }
];

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = storage.get<User>('harmoni_user');
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Failed to restore auth session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginForm): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic
      const foundUser = mockUsers.find(u => u.email === credentials.email);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // In a real app, you'd validate the password here
      setUser(foundUser);
      storage.set('harmoni_user', foundUser);
      
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (data: RegisterForm): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === data.email || u.username === data.username);
      
      if (existingUser) {
        throw new Error('User already exists with this email or username');
      }
      
      // Create new user
      const newUser: User = {
        id: randomId(),
        email: data.email,
        username: data.username,
        displayName: data.displayName,
        avatar: `https://picsum.photos/seed/${data.username}/200/200`,
        bio: '',
        skills: [],
        genres: [],
        instruments: [],
        role: data.role,
        experience: ExperienceLevel.BEGINNER,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // In a real app, you'd save to database
      mockUsers.push(newUser);
      
      setUser(newUser);
      storage.set('harmoni_user', newUser);
      
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    storage.remove('harmoni_user');
    storage.remove('harmoni_token');
  }, []);

  // Update profile function
  const updateProfile = useCallback(async (updates: Partial<User>): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) {
        throw new Error('User not found');
      }
      
      const updatedUser: User = {
        ...user,
        ...updates,
        updatedAt: new Date()
      };
      
      // Update in mock data
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }
      
      setUser(updatedUser);
      storage.set('harmoni_user', updatedUser);
      
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Refresh user function
  const refreshUser = useCallback(async (): Promise<void> => {
    if (!user) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you'd fetch fresh data from server
      const refreshedUser = mockUsers.find(u => u.id === user.id);
      
      if (refreshedUser) {
        setUser(refreshedUser);
        storage.set('harmoni_user', refreshedUser);
      }
      
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Helper function to generate random ID
function randomId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Hook for authentication state
export const useAuthState = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  return { user, isLoading, isAuthenticated };
};

// Hook for user role checking
export const useUserRole = () => {
  const { user } = useAuth();
  return user?.role;
};

// Hook for user permissions
export const useUserPermissions = () => {
  const { user } = useAuth();
  
  const canCreateProject = !!user;
  const canCollaborate = !!user && user.experience !== ExperienceLevel.BEGINNER;
  const canManageUsers = user?.role === UserRole.PRODUCER || user?.role === UserRole.COMPOSER;
  const canAccessAI = user?.experience === ExperienceLevel.PROFESSIONAL;
  
  return {
    canCreateProject,
    canCollaborate,
    canManageUsers,
    canAccessAI,
    isOwner: (projectId: string) => {
      // In a real app, you'd check if user owns the project
      return true;
    }
  };
};

export default useAuth;