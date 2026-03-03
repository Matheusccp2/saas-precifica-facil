"use client";

import { useState, useEffect } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setIsActive(userDoc.data()?.isActive ?? false);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      email,
      displayName,
      isActive: false,
      plan: "free",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Envia e-mail de verificação protegendo contra erros de disparo
    try {
      await sendEmailVerification(cred.user);
    } catch (err) {
      console.error("Erro ao enviar email de verificação:", err);
      // Opcional: Aqui nós só fazemos log. O usuário já foi criado.
    }

    return cred;
  };

  const logout = () => signOut(auth);

  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

  // ── Reautentica e deleta conta completamente ──
  const deleteAccount = async (password: string): Promise<void> => {
    if (!user || !user.email) throw new Error("Usuário não autenticado.");

    // Reautentica para garantir sessão recente
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);

    // Deleta do Authentication
    await deleteUser(user);
  };

  return {
    user,
    loading,
    isActive,
    login,
    register,
    logout,
    resetPassword,
  };
}