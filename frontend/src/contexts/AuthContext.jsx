import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { createUserProfile, getUserProfile, checkAndUpdateStreak, getUserStreak, updateStreakOnDailyCompletion } from '../firebase/firestore';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userStreak, setUserStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Create or get user profile in Firestore
        await createUserProfile(user);
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);

        // Check and update streak status
        const streak = await checkAndUpdateStreak(user.uid);
        setUserStreak(streak);
      } else {
        setUserProfile(null);
        setUserStreak(null);
      }

      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Function to refresh user profile data
  const refreshUserProfile = async () => {
    if (currentUser) {
      const profile = await getUserProfile(currentUser.uid);
      setUserProfile(profile);
      return profile;
    }
    return null;
  };

  // Function to refresh user streak data - memoized with useCallback
  const refreshUserStreak = useCallback(async () => {
    if (currentUser) {
      const streak = await getUserStreak(currentUser.uid);
      setUserStreak(streak);
      return streak;
    }
    return null;
  }, [currentUser]);

  // Function to update streak when daily problem is completed - memoized with useCallback
  const updateDailyStreak = useCallback(async (problemId) => {
    if (currentUser) {
      const updatedStreak = await updateStreakOnDailyCompletion(currentUser.uid, problemId);
      setUserStreak(updatedStreak);
      return updatedStreak;
    }
    return null;
  }, [currentUser]);

  // Context value
  const value = {
    currentUser,
    userProfile,
    userStreak,
    refreshUserProfile,
    refreshUserStreak,
    updateDailyStreak,
    isAuthenticated: !!currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
