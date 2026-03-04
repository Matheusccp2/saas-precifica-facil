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
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
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
    const cred = await signInWithEmailAndPassword(auth, email, password);

    // Verifica se existe pagamento aprovado para este e-mail
    await checkAndActivateByEmail(cred.user.uid, email);

    return cred;
  };

  const register = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });

    // Cria o documento do usuário
    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      email,
      displayName,
      isActive: false,
      plan: "free",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Verifica se já existe pagamento aprovado para este e-mail
    await checkAndActivateByEmail(cred.user.uid, email);

    return cred;
  };

  // Verifica na coleção payments se existe pagamento aprovado
  // para o e-mail e ativa o usuário automaticamente
  const checkAndActivateByEmail = async (uid: string, email: string) => {
    try {
      console.log("🔍 Verificando pagamento para:", email);

      const res = await fetch("/api/activate-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, email }),
      });

      const data = await res.json();

      if (data.activated) {
        console.log("🎉 Usuário ativado com sucesso!");
        setIsActive(true);
      } else {
        console.log("ℹ️ Sem pagamento encontrado:", data.reason);
      }
    } catch (error) {
      console.error("❌ Erro ao verificar pagamento:", error);
    }
  };

  const logout = () => signOut(auth);

  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

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