"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Clock, CheckCircle, MessageCircle, Calculator, Loader2 } from "lucide-react";

const WHATSAPP_NUMBER = "5511999999999";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Fiz o pagamento do PrecificaFácil e está pendente.")}`;

export default function PagamentoPendentePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"pending" | "approved" | "checking">("pending");
  const [attempts, setAttempts] = useState(0);

  const paymentId = searchParams.get("payment_id");

  useEffect(() => {
    if (!paymentId) return;

    // Verifica o status do pagamento a cada 5 segundos
    const interval = setInterval(async () => {
      if (attempts >= 24) { // Para após 2 minutos
        clearInterval(interval);
        return;
      }

      try {
        setStatus("checking");
        const res = await fetch(`/api/check-payment?payment_id=${paymentId}`);
        const data = await res.json();

        if (data.status === "approved") {
          clearInterval(interval);
          setStatus("approved");
          // Redireciona para sucesso após 2 segundos
          setTimeout(() => router.push("/pagamento/sucesso"), 2000);
        } else {
          setStatus("pending");
          setAttempts((a) => a + 1);
        }
      } catch {
        setStatus("pending");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [paymentId, attempts, router]);

  // Aprovado!
  if (status === "approved") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Pagamento confirmado!
            </h1>
            <p className="text-gray-600">Redirecionando...</p>
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mt-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold">
            <span className="text-gray-900">Precifica</span>
            <span className="text-blue-600">Fácil</span>
          </span>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {status === "checking"
              ? <Loader2 className="w-8 h-8 text-yellow-600 animate-spin" />
              : <Clock className="w-8 h-8 text-yellow-600" />
            }
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Aguardando pagamento PIX
          </h1>

          <p className="text-gray-600 mb-2">
            {status === "checking"
              ? "Verificando seu pagamento..."
              : "Estamos monitorando seu pagamento automaticamente."}
          </p>

          <p className="text-sm text-gray-500 mb-6">
            Após pagar o PIX, aguarde alguns segundos. Esta página será
            atualizada automaticamente assim que confirmarmos o pagamento.
          </p>

          {/* Indicador de verificação */}
          {paymentId && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
              <p className="text-xs text-blue-700 font-medium">
                Verificando automaticamente a cada 5 segundos...
              </p>
            </div>
          )}

          {/* Já pagou mas não redirecionou? */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs text-gray-500 mb-3">
              Já pagou e quer acessar agora?
            </p>
            <div className="space-y-2">
              <Link
                href="/pagamento/sucesso"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm"
              >
                Já paguei — Criar minha conta
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 text-white font-semibold py-2.5 rounded-xl hover:bg-green-600 transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Falar com suporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}