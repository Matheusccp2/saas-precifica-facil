"use client";

import { User } from "firebase/auth";
import { User as UserIcon } from "lucide-react";

interface AccountInfoProps {
  user: User | null;
}

export function AccountInfo({ user }: AccountInfoProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <UserIcon className="w-4 h-4 text-blue-600" />
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
  );
}
