"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { exportUserData, deleteAllUserData } from "@/lib/firestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User, Shield, Download, Trash2,
  Loader2, AlertTriangle, CheckCircle,
} from "lucide-react";

export default function ConfiguracoesPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");

  const handleExport = async () => {
    if (!user) return;
    setExporting(true);
    try {
      const data = await exportUserData(user.uid);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `meus-dados-precificafacil-${new Date().toISOString().split("T")[0]}.json`;
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
    if (!user || confirmDelete !== "EXCLUIR") return;
    setDeleting(true);
    try {
      await deleteAllUserData(user.uid);
      await logout();
      toast.success("Conta e dados excluídos. Até logo!");
      router.push("/");
    } catch {
      toast.error("Erro ao excluir conta.");
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
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500">Nome</span>
            <span className="text-sm font-medium text-gray-900">{user?.displayName ?? "—"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500">E-mail</span>
            <span className="text-sm font-medium text-gray-900">{user?.email ?? "—"}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-gray-500">ID da conta</span>
            <span className="text-xs font-mono text-gray-400">{user?.uid}</span>
          </div>
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
          Em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018), você tem os seguintes direitos:
        </p>

        <div className="space-y-3 mb-6">
          {[
            { icon: CheckCircle, color: "text-green-500", text: "Acesso aos seus dados pessoais armazenados" },
            { icon: CheckCircle, color: "text-green-500", text: "Portabilidade: exportar todos os seus dados" },
            { icon: CheckCircle, color: "text-green-500", text: "Direito ao esquecimento: excluir sua conta e dados" },
            { icon: CheckCircle, color: "text-green-500", text: "Dados coletados: nome, e-mail e cálculos realizados" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <item.icon className={`w-4 h-4 ${item.color} flex-shrink-0 mt-0.5`} />
              <span className="text-sm text-gray-700">{item.text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-60"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
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
        <p className="text-sm text-red-700 mb-4">
          Esta ação é <strong>irreversível</strong>. Todos os seus dados (conta, histórico e cálculos) serão permanentemente excluídos em conformidade com a LGPD.
        </p>
        <p className="text-sm text-gray-700 mb-2">
          Para confirmar, digite <strong>EXCLUIR</strong> abaixo:
        </p>
        <input
          type="text"
          value={confirmDelete}
          onChange={(e) => setConfirmDelete(e.target.value)}
          placeholder="EXCLUIR"
          className="w-full px-4 py-2.5 border border-red-200 rounded-xl text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
        />
        <button
          onClick={handleDeleteAccount}
          disabled={confirmDelete !== "EXCLUIR" || deleting}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          {deleting ? "Excluindo..." : "Excluir minha conta permanentemente"}
        </button>
      </div>
    </div>
  );
}