import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, addDoc, query, where, getDocs, increment, arrayUnion, serverTimestamp, Timestamp } from 'firebase/firestore';
import app from './config';
import { auth } from './config';

// Initialize Firestore
const db = getFirestore(app);

// User-related functions
export const createUserProfile = async (user) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create new user profile
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
        stats: {
          problemsSolved: 0,
          submissions: 0,
          acceptanceRate: 0
        }
      });
    }

    return userRef;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const updateUserStats = async (userId, isAccepted) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentStats = userData.stats || { problemsSolved: 0, submissions: 0, acceptanceRate: 0 };

      // Increment submissions count
      const newSubmissions = currentStats.submissions + 1;

      // If accepted, increment problems solved
      let newProblemsSolved = currentStats.problemsSolved;
      if (isAccepted) {
        newProblemsSolved += 1;
      }

      // Calculate new acceptance rate
      const newAcceptanceRate = newSubmissions > 0
        ? Math.round((newProblemsSolved / newSubmissions) * 100)
        : 0;

      // Update user stats
      await updateDoc(userRef, {
        'stats.submissions': newSubmissions,
        'stats.problemsSolved': newProblemsSolved,
        'stats.acceptanceRate': newAcceptanceRate
      });

      return {
        problemsSolved: newProblemsSolved,
        submissions: newSubmissions,
        acceptanceRate: newAcceptanceRate
      };
    }

    return null;
  } catch (error) {
    throw error;
  }
};

// Code editor state functions
export const saveUserCode = async (userId, problemId, code, language) => {
  try {
    const codeRef = doc(db, 'userCode', `${userId}_${problemId}`);

    await setDoc(codeRef, {
      userId,
      problemId,
      code,
      language,
      lastUpdated: serverTimestamp()
    }, { merge: true });

    return codeRef;
  } catch (error) {
    throw error;
  }
};

export const getUserCode = async (userId, problemId) => {
  try {
    const codeRef = doc(db, 'userCode', `${userId}_${problemId}`);
    const codeSnap = await getDoc(codeRef);

    if (codeSnap.exists()) {
      return codeSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

// Submission history functions
export const saveSubmission = async (userId, problemId, submissionData) => {
  try {
    // Determine difficulty if provided or use helper function
    const difficulty = submissionData.difficulty || getProblemDifficultyFromId(problemId) || 'Medium';

    // Add submission to submissions collection
    const submissionRef = await addDoc(collection(db, 'submissions'), {
      userId,
      problemId,
      code: submissionData.code,
      language: submissionData.language,
      status: submissionData.status,
      runtime: submissionData.runtime || 'N/A',
      memory: submissionData.memory || 'N/A',
      timestamp: serverTimestamp(),
      result: submissionData.result || {},
      difficulty: difficulty, // Store the difficulty with the submission
      isDailyChallenge: submissionData.isDailyChallenge || false
    });

    // Update problem status for the user
    const statusRef = doc(db, 'userProblemStatus', `${userId}_${problemId}`);
    const isAccepted = submissionData.status === 'Accepted';

    await setDoc(statusRef, {
      userId,
      problemId,
      status: isAccepted ? 'solved' : 'attempted',
      lastAttempted: serverTimestamp(),
      difficulty: difficulty, // Store the difficulty with the problem status
      isDailyChallenge: submissionData.isDailyChallenge || false
    }, { merge: true });

    // Update user stats
    await updateUserStats(userId, isAccepted);

    // If this is a daily challenge and it was accepted, update the streak
    if (submissionData.isDailyChallenge && isAccepted) {
      await updateStreakOnDailyCompletion(userId, problemId);
    }

    return submissionRef.id;
  } catch (error) {
    throw error;
  }
};

export const getUserSubmissions = async (userId, problemId = null) => {
  try {
    let submissionsQuery;

    if (problemId) {
      // Get submissions for a specific problem
      submissionsQuery = query(
        collection(db, 'submissions'),
        where('userId', '==', userId),
        where('problemId', '==', problemId)
      );
    } else {
      // Get all user submissions
      submissionsQuery = query(
        collection(db, 'submissions'),
        where('userId', '==', userId)
      );
    }

    const submissionsSnap = await getDocs(submissionsQuery);
    const submissions = [];

    submissionsSnap.forEach((doc) => {
      const data = doc.data();
      // Add difficulty if available from problem metadata
      submissions.push({
        id: doc.id,
        ...data,
        // Default difficulty to ensure we have this field
        difficulty: data.difficulty || getProblemDifficultyFromId(data.problemId) || 'Medium'
      });
    });

    // Sort by timestamp (newest first)
    return submissions.sort((a, b) => {
      const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
      const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
      return timeB - timeA;
    });
  } catch (error) {
    throw error;
  }
};

// Helper function to determine problem difficulty based on problem ID patterns
// This is a fallback when the difficulty isn't stored directly
const getProblemDifficultyFromId = (problemId) => {
  if (!problemId) return null;

  // Convert to lowercase for case-insensitive matching
  const id = problemId.toLowerCase();

  // Common patterns for difficulty levels
  if (id.includes('easy') || id.startsWith('two-sum') || id.includes('palindrome')) {
    return 'Easy';
  } else if (id.includes('hard') || id.includes('median') || id.includes('skyline')) {
    return 'Hard';
  } else {
    return 'Medium';
  }
};

// Problem status functions
export const getUserProblemStatus = async (userId, problemId) => {
  try {
    const statusRef = doc(db, 'userProblemStatus', `${userId}_${problemId}`);
    const statusSnap = await getDoc(statusRef);

    if (statusSnap.exists()) {
      return statusSnap.data().status;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const getAllUserProblemStatuses = async (userId) => {
  try {
    const statusQuery = query(
      collection(db, 'userProblemStatus'),
      where('userId', '==', userId)
    );

    const statusSnap = await getDocs(statusQuery);
    const statuses = {};

    statusSnap.forEach((doc) => {
      const data = doc.data();
      statuses[data.problemId] = data.status;
    });

    return statuses;
  } catch (error) {
    throw error;
  }
};

// Streak-related functions
export const getUserStreak = async (userId) => {
  try {
    const streakRef = doc(db, 'userStreaks', userId);
    const streakSnap = await getDoc(streakRef);

    if (streakSnap.exists()) {
      return streakSnap.data();
    } else {
      // Initialize streak data if it doesn't exist
      const initialStreakData = {
        currentStreak: 0,
        maxStreak: 0,
        lastDailyProblemDate: null,
        lastCheckDate: null,
        isDailyProblemCompleted: false
      };

      await setDoc(streakRef, initialStreakData);
      return initialStreakData;
    }
  } catch (error) {
    throw error;
  }
};

// Function to update streak when daily problem is completed
export const updateStreakOnDailyCompletion = async (userId, problemId) => {
  try {
    // Get current streak data
    const streakRef = doc(db, 'userStreaks', userId);
    const streakSnap = await getDoc(streakRef);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayTimestamp = Timestamp.fromDate(today);

    let streakData;

    if (streakSnap.exists()) {
      streakData = streakSnap.data();

      // If already completed today, just return the current streak
      if (streakData.isDailyProblemCompleted &&
          streakData.lastDailyProblemDate &&
          isSameDay(streakData.lastDailyProblemDate.toDate(), today)) {
        return streakData;
      }

      // Check if this is a consecutive day
      let newStreak = streakData.currentStreak;

      if (streakData.lastDailyProblemDate) {
        const lastDate = streakData.lastDailyProblemDate.toDate();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (isSameDay(lastDate, yesterday)) {
          // Consecutive day, increment streak
          newStreak += 1;
        } else if (isSameDay(lastDate, today)) {
          // Same day, maintain streak
          newStreak = streakData.currentStreak;
        } else {
          // Streak broken, reset to 1
          newStreak = 1;
        }
      } else {
        // First time solving, set streak to 1
        newStreak = 1;
      }

      // Update streak data
      const updatedStreakData = {
        currentStreak: newStreak,
        maxStreak: Math.max(newStreak, streakData.maxStreak || 0),
        lastDailyProblemDate: todayTimestamp,
        lastCheckDate: Timestamp.fromDate(now),
        isDailyProblemCompleted: true,
        lastCompletedProblemId: problemId
      };

      await updateDoc(streakRef, updatedStreakData);
      return { ...updatedStreakData, updated: true };

    } else {
      // First time solving any problem, initialize streak
      streakData = {
        currentStreak: 1,
        maxStreak: 1,
        lastDailyProblemDate: todayTimestamp,
        lastCheckDate: Timestamp.fromDate(now),
        isDailyProblemCompleted: true,
        lastCompletedProblemId: problemId
      };

      await setDoc(streakRef, streakData);
      return { ...streakData, updated: true };
    }
  } catch (error) {
    throw error;
  }
};

// Function to check and reset streak if needed (called at app startup)
export const checkAndUpdateStreak = async (userId) => {
  try {
    const streakRef = doc(db, 'userStreaks', userId);
    const streakSnap = await getDoc(streakRef);

    if (!streakSnap.exists()) {
      // No streak data yet, initialize with zeros
      const initialData = {
        currentStreak: 0,
        maxStreak: 0,
        lastDailyProblemDate: null,
        lastCheckDate: Timestamp.fromDate(new Date()),
        isDailyProblemCompleted: false
      };
      await setDoc(streakRef, initialData);
      return initialData;
    }

    const streakData = streakSnap.data();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check if we need to reset the daily problem completion status
    // Reset happens at 5:30 AM IST (UTC+5:30)
    const resetTime = new Date(today);
    resetTime.setHours(5);
    resetTime.setMinutes(30);
    resetTime.setSeconds(0);
    resetTime.setMilliseconds(0);

    // Adjust for IST (UTC+5:30)
    resetTime.setMinutes(resetTime.getMinutes() - 330); // Convert from IST to local time

    let updatedData = { ...streakData };
    let needsUpdate = false;

    // If last check was before today's reset time and now is after reset time
    if ((!streakData.lastCheckDate || streakData.lastCheckDate.toDate() < resetTime) && now >= resetTime) {
      // Check if the user completed yesterday's problem
      if (!streakData.isDailyProblemCompleted && streakData.lastDailyProblemDate) {
        const lastProblemDate = streakData.lastDailyProblemDate.toDate();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // If the last problem wasn't completed yesterday, reset streak
        if (!isSameDay(lastProblemDate, yesterday)) {
          updatedData.currentStreak = 0;
          needsUpdate = true;
        }
      } else if (!streakData.isDailyProblemCompleted) {
        // No problem completed recently, reset streak
        updatedData.currentStreak = 0;
        needsUpdate = true;
      }

      // Reset daily completion status for the new day
      updatedData.isDailyProblemCompleted = false;
      updatedData.lastCheckDate = Timestamp.fromDate(now);
      needsUpdate = true;
    }

    if (needsUpdate) {
      await updateDoc(streakRef, updatedData);
    }

    return updatedData;
  } catch (error) {
    throw error;
  }
};

// Helper function to check if two dates are the same day
function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};
