import Link from "next/link";
import { CheckCircle, ArrowRight, Calculator, Mail, Info } from "lucide-react";

export default function PagamentoSucessoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
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
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acesso liberado! 🎉
          </h1>

          <p className="text-gray-600 mb-6">
            Sua conta foi criada automaticamente.
          </p>

          {/* Instrução de e-mail */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-800 mb-1">
                  Verifique seu e-mail
                </p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Enviamos seus dados de acesso (login e senha temporária)
                  para o e-mail informado no pagamento.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-6">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Não recebeu o e-mail? Verifique a caixa de spam ou entre em
                contato com o suporte.
              </p>
            </div>
          </div>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Fazer login agora
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}