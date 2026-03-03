"use client";

import { useAuth } from "@/hooks/useAuth";
import { AccountInfo } from "@/components/settings/AccountInfo";
import { LgpdSection } from "@/components/settings/LgpdSection";
import { DeleteAccountSection } from "@/components/settings/DeleteAccountSection";

export default function ConfiguracoesPage() {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Gerencie sua conta e privacidade</p>
      </div>

      <AccountInfo user={user} />
      <LgpdSection user={user} />
      <DeleteAccountSection user={user} />
    </div>
  );
}
