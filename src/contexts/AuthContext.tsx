import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  userType: 'business' | 'investor';
  isOnboardingCompleted: boolean;
  startupBrief?: string;
  phone?: string;
  location?: string;
  
  // AI-generated startup categorization
  industry?: string;
  stage?: string;
  revenueRange?: string;
  fundingAmount?: string;
  investmentType?: string;
  businessModel?: string;
  targetMarket?: string;
  techStack?: string;
  teamSize?: string;
  aiConfidence?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userType: 'business' | 'investor') => Promise<void>;
  signInWithGoogle: () => Promise<{ isNewUser: boolean }>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setUserType: (userType: 'business' | 'investor') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const createUserProfile = async (user: User, userType: 'business' | 'investor') => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.log('Creating new user profile in Firestore');
        const profile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || '',
          userType,
          isOnboardingCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await setDoc(userRef, profile);
        console.log('User profile created successfully:', profile);
        setUserProfile(profile);
        return profile;
      } else {
        console.log('User profile already exists, using existing profile');
        const profile = userSnap.data() as UserProfile;
        setUserProfile(profile);
        return profile;
      }
    } catch (error: any) {
      console.error('Error creating user profile:', error);
      
      // Handle offline/Firestore not configured error
      if (error.code === 'unavailable' || error.message.includes('offline')) {
        console.warn('Firestore is offline or not configured. Creating temporary profile.');
        // Create a temporary profile for development
        const tempProfile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || '',
          userType,
          isOnboardingCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setUserProfile(tempProfile);
        return tempProfile;
      }
      
      throw error;
    }
  };

  const fetchUserProfile = async (uid: string) => {
    try {
      console.log('Fetching user profile for UID:', uid);
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const profile = userSnap.data() as UserProfile;
        console.log('User profile fetched successfully:', profile);
        setUserProfile(profile);
        return profile;
      } else {
        console.log('No user profile found in Firestore');
        setUserProfile(null);
        return null;
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      
      // Handle offline/Firestore not configured error
      if (error.code === 'unavailable' || error.message.includes('offline')) {
        console.warn('Firestore is offline or not configured. Creating temporary profile.');
        // Create a temporary profile for development
        const tempProfile: UserProfile = {
          uid: uid,
          email: user?.email || '',
          displayName: user?.displayName || '',
          userType: 'business',
          isOnboardingCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setUserProfile(tempProfile);
        return tempProfile;
      }
      
      setUserProfile(null);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await fetchUserProfile(result.user.uid);
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userType: 'business' | 'investor') => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(result.user, userType);
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<{ isNewUser: boolean }> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign-in successful:', result.user.email);
      
      // Check if user profile exists
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        console.log('New Google user detected - user needs to select type');
        // Don't create profile yet - let user choose type first
        return { isNewUser: true };
      } else {
        console.log('Existing user profile found, fetching...');
        await fetchUserProfile(result.user.uid);
        return { isNewUser: false };
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) return;

    const userRef = doc(db, 'users', user.uid);
    const updatedProfile = {
      ...userProfile,
      ...updates,
      updatedAt: new Date(),
    };

    await setDoc(userRef, updatedProfile, { merge: true });
    setUserProfile(updatedProfile);

    // Update Firebase Auth profile if displayName is changed
    if (updates.displayName !== undefined) {
      await updateProfile(user, { displayName: updates.displayName });
    }
  };

  const setUserType = async (userType: 'business' | 'investor') => {
    if (!user) {
      throw new Error('No authenticated user found');
    }

    try {
      // Create the user profile with the selected type
      await createUserProfile(user, userType);
    } catch (error: any) {
      console.error('Error setting user type:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      if (user) {
        setUser(user);
        const profile = await fetchUserProfile(user.uid);
        console.log('User profile:', profile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    updateUserProfile,
    setUserType,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};