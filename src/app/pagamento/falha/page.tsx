import Link from "next/link";
import { XCircle, ArrowLeft, MessageCircle, Calculator } from "lucide-react";

const WHATSAPP_NUMBER = "5511999999999"; // ← seu número
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Tive um problema no pagamento do PrecificaFácil.")}`;

export default function PagamentoFalhaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 flex items-center justify-center p-4">
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
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pagamento não aprovado
          </h1>
          <p className="text-gray-600 mb-6">
            Houve um problema com seu pagamento. Você pode tentar novamente
            ou entrar em contato com o suporte.
          </p>
          <div className="space-y-3">
            <Link
              href="/planos"
              className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Tentar novamente
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 text-white font-semibold py-3 rounded-xl hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Falar com suporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}