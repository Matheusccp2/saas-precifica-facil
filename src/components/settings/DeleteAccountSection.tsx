"use client";

import { useState } from "react";
import { User } from "firebase/auth";
import { AlertTriangle, Lock, EyeOff, Eye, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { deleteAllUserData } from "@/lib/firestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EmailAuthProvider, reauthenticateWithCredential, deleteUser as fbDeleteUser } from "firebase/auth";

interface DeleteAccountSectionProps {
  user: User | null;
}

export function DeleteAccountSection({ user }: DeleteAccountSectionProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const canDelete = confirmText === "EXCLUIR" && password.length >= 6;

  const handleDeleteAccount = async () => {
    if (!user || !canDelete) return;
    setDeleting(true);
    setDeleteError("");

    try {
      // 1. Reautentica
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);

      // 2. Deleta dados do Firestore ANTES de invalidar o Auth
      await deleteAllUserData(user.uid);

      // 3. Deleta do Firebase Auth por último
      await fbDeleteUser(user);

      toast.success("Conta excluída com sucesso. Até logo!");
      router.push("/");
    } catch (error: any) {
      console.error("Erro ao excluir conta:", error);

      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        setDeleteError("Senha incorreta. Verifique e tente novamente.");
      } else if (error.code === "auth/too-many-requests") {
        setDeleteError("Muitas tentativas. Aguarde alguns minutos.");
      } else if (error.code === "permission-denied") {
        setDeleteError(
          "Erro de permissão. Tente fazer logout e login novamente antes de excluir.",
        );
      } else {
        setDeleteError("Erro ao excluir conta. Tente novamente.");
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-red-600" />
        </div>
        <h2 className="font-bold text-red-900">Excluir Conta</h2>
      </div>

      <p className="text-sm text-red-700 mb-5">
        Esta ação é <strong>irreversível</strong>. Todos os seus dados (conta,
        histórico e cálculos) serão permanentemente excluídos em conformidade
        com a LGPD.
      </p>

      <div className="space-y-3">
        {/* Senha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <Lock className="w-3.5 h-3.5 inline mr-1" />
            Confirme sua senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setDeleteError("");
              }}
              placeholder="Digite sua senha atual"
              className="w-full px-4 py-2.5 border border-red-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirmação texto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Digite <strong>EXCLUIR</strong> para confirmar
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="EXCLUIR"
            className="w-full px-4 py-2.5 border border-red-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* Erro */}
        {deleteError && (
          <div className="flex items-center gap-2 bg-red-100 border border-red-200 rounded-xl px-4 py-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{deleteError}</p>
          </div>
        )}

        {/* Botão */}
        <button
          onClick={handleDeleteAccount}
          disabled={!canDelete || deleting}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {deleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          {deleting
            ? "Excluindo conta..."
            : "Excluir minha conta permanentemente"}
        </button>
      </div>
    </div>
  );
}
