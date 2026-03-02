"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { exportUserData, deleteAllUserData } from "@/lib/firestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User,
  Shield,
  Download,
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";

export default function ConfiguracoesPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const canDelete = confirmText === "EXCLUIR" && password.length >= 6;

  const handleExport = async () => {
    if (!user) return;
    setExporting(true);
    try {
      const data = await exportUserData(user.uid);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `meus-dados-precificafacil-${
        new Date().toISOString().split("T")[0]
      }.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Seus dados foram exportados com sucesso!");
    } catch {
      toast.error("Erro ao exportar dados.");
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !canDelete) return;
    setDeleting(true);
    setDeleteError("");

    try {
      const { EmailAuthProvider, reauthenticateWithCredential, deleteUser } =
        await import("firebase/auth");

      // 1. Reautentica
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);

      // 2. Deleta dados do Firestore ANTES de invalidar o Auth
      await deleteAllUserData(user.uid);

      // 3. Deleta do Firebase Auth por último
      await deleteUser(user);

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
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Gerencie sua conta e privacidade</p>
      </div>

      {/* Perfil */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="font-bold text-gray-900">Informações da Conta</h2>
        </div>
        <div className="space-y-1">
          {[
            { label: "Nome", value: user?.displayName ?? "—" },
            { label: "E-mail", value: user?.email ?? "—" },
            { label: "ID da conta", value: user?.uid ?? "—", mono: true },
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0"
            >
              <span className="text-sm text-gray-500">{item.label}</span>
              <span
                className={`text-sm font-medium text-gray-900 ${
                  item.mono ? "font-mono text-xs text-gray-400" : ""
                }`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* LGPD */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-green-600" />
          </div>
          <h2 className="font-bold text-gray-900">Privacidade e LGPD</h2>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº
          13.709/2018), você tem os seguintes direitos:
        </p>
        <div className="space-y-2 mb-6">
          {[
            "Acesso aos seus dados pessoais armazenados",
            "Portabilidade: exportar todos os seus dados",
            "Direito ao esquecimento: excluir sua conta e dados",
            "Dados coletados: nome, e-mail e cálculos realizados",
          ].map((text) => (
            <div key={text} className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{text}</span>
            </div>
          ))}
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-60"
        >
          {exporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {exporting ? "Exportando..." : "Exportar meus dados (JSON)"}
        </button>
      </div>

      {/* Excluir conta */}
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
    </div>
  );
}
