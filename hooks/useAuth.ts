"use client";

import { auth, db } from "@/lib/firebase";
import { AppUser } from "@/types/user";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setAppUser(null);
        setAuthLoading(false);
        return;
      }

      await ensureUserProfile(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    const unsubscribeProfile = onSnapshot(userRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.data();

      setAppUser({
        uid: snapshot.id,
        email: data.email || user.email || "",
        role: data.role || "user",
        createdAt: data.createdAt?.toMillis?.() || 0,
      });
    });

    return () => unsubscribeProfile();
  }, [user]);

  async function ensureUserProfile(firebaseUser: User) {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) return;

    await setDoc(userRef, {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      role: "user",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async function register(email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await ensureUserProfile(credential.user);

    return credential;
  }

  async function login(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    await ensureUserProfile(credential.user);

    return credential;
  }

  async function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  async function logout() {
    return signOut(auth);
  }

  return {
    user,
    appUser,
    authLoading,
    register,
    login,
    resetPassword,
    logout,
  };
}
