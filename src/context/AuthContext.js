import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { onAuthStateChanged, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext({ user: null, isAdmin: false });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(true);

  // Listen to Firebase Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Firestore-based admin role check OR hardcoded admin override
  useEffect(() => {
    setIsAdmin(false);
    setAdminLoading(true);

    const email = user?.email?.toLowerCase();
    const hardcodedAdmin = email === 'admin@gmail.com';

    if (!email) {
      setAdminLoading(false);
      return;
    }

    // If hardcoded admin email, grant admin immediately without subscribing
    if (hardcodedAdmin) {
      setIsAdmin(true);
      setAdminLoading(false);
      return;
    }

    const ref = doc(db, 'admins', email);
    const unsub = onSnapshot(ref, (snap) => {
      const exists = snap.exists();
      const data = exists ? snap.data() : {};
      setIsAdmin(!!exists && (data.active ?? true));
      setAdminLoading(false);
    }, () => {
      setIsAdmin(false);
      setAdminLoading(false);
    });

    return () => unsub();
  }, [user?.email]);

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  // Email/password login with special-case support for admin@gmail.com/admin
  const loginWithEmailPassword = async (email, password) => {
    const e = (email || '').toLowerCase().trim();
    const p = password || '';

    try {
      await signInWithEmailAndPassword(auth, e, p);
    } catch (err) {
      // If the admin hardcoded user doesn't exist yet, create it on the fly
      if (e === 'admin@gmail.com' && p === 'admin123' && err?.code === 'auth/user-not-found') {
        await createUserWithEmailAndPassword(auth, e, p);
        return;
      }
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const loading = authLoading || adminLoading;
  const value = { user, isAdmin, loading, loginWithGoogle, loginWithEmailPassword, logout };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
