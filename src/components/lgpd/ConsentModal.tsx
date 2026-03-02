"use client";

import { useState } from "react";
import { Shield, X, CheckCircle } from "lucide-react";

interface Props {
  open: boolean;
  onAccept: () => void;
  onClose: () => void;
}

export default function ConsentModal({ open, onAccept, onClose }: Props) {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="font-bold text-gray-900">Privacidade e Termos de Uso</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Para utilizar o PrecificaFácil, precisamos do seu consentimento conforme a{" "}
            <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-gray-700">
            <p className="font-semibold text-gray-900 mb-2">📋 Dados que coletamos:</p>
            <p>• Nome e e-mail para criação da conta</p>
            <p>• Cálculos de precificação que você realiza</p>
            <p>• Dados de acesso para segurança</p>
            <p className="mt-3 font-semibold text-gray-900">🔒 Como usamos:</p>
            <p>• Exclusivamente para fornecer o serviço</p>
            <p>• Nunca vendemos ou compartilhamos com terceiros</p>
            <p>• Você pode exportar ou excluir seus dados a qualquer momento</p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checked1}
              onChange={(e) => setChecked1(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-blue-600"
            />
            <span className="text-sm text-gray-700">
              Li e concordo com os{" "}
              <a href="#" className="text-blue-600 underline">Termos de Uso</a>{" "}
              e a{" "}
              <a href="#" className="text-blue-600 underline">Política de Privacidade</a>
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checked2}
              onChange={(e) => setChecked2(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-blue-600"
            />
            <span className="text-sm text-gray-700">
              Autorizo o tratamento dos meus dados pessoais conforme descrito acima, nos termos da LGPD.
            </span>
          </label>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onAccept}
            disabled={!checked1 || !checked2}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Aceitar e continuar
          </button>
        </div>
      </div>
    </div>
  );
}