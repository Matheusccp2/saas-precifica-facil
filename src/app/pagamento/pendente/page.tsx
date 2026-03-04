"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, MessageCircle, Calculator, Loader2, Mail } from "lucide-react";
import Link from "next/link";

const WHATSAPP_NUMBER = "5511999999999";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Precisei de ajuda no pagamento do PrecificaFácil.")}`;

export default function PagamentoPendentePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [approved, setApproved] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const paymentId = searchParams.get("payment_id");

  // Contador de segundos
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Polling a cada 5 segundos
  useEffect(() => {
    if (!paymentId) return;

    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 36) { // Para após 3 minutos
        clearInterval(interval);
        return;
      }

      try {
        const res = await fetch(`/api/check-payment?payment_id=${paymentId}`);
        const data = await res.json();

        if (data.status === "approved") {
          clearInterval(interval);
          setApproved(true);
          setTimeout(() => router.push("/pagamento/sucesso"), 2500);
        }
      } catch {
        // silencia erro de rede e tenta novamente
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [paymentId, router]);

  if (approved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Pagamento confirmado! 🎉
            </h1>
            <p className="text-gray-600 mb-1">Sua conta foi criada automaticamente.</p>
            <p className="text-sm text-gray-500">Verifique seu e-mail com os dados de acesso.</p>
            <div className="flex items-center justify-center gap-2 mt-6 text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Redirecionando...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 justify-center">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">
              <span className="text-gray-900">Precifica</span>
              <span className="text-blue-600">Fácil</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          {/* Animação de espera */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-blue-100 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Aguardando seu PIX
          </h1>
          <p className="text-gray-600 mb-1">
            Estamos monitorando o pagamento automaticamente.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Verificando há {seconds}s...
          </p>

          {/* Passos para o usuário */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left space-y-3">
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">
              O que acontece após o pagamento:
            </p>
            {[
              "Confirmamos seu PIX automaticamente",
              "Criamos sua conta com e-mail e senha",
              "Enviamos os dados de acesso por e-mail",
              "É só fazer login e começar a usar!",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm text-blue-700">{step}</p>
              </div>
            ))}
          </div>

          {/* E-mail */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 mb-6">
            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <p className="text-xs text-gray-600">
              Após o pagamento você receberá um e-mail com seu login e senha temporária.
            </p>
          </div>

          {/* Suporte */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs text-gray-400 mb-3">Algum problema?</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 text-white font-semibold py-3 rounded-xl hover:bg-green-600 transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Falar com suporte via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}