import Link from "next/link";
import { Calculator, Clock, Mail, CheckCircle } from "lucide-react";

export default function AguardandoAtivacaoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
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
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Conta criada com sucesso!
          </h1>
          <p className="text-gray-600 mb-6">
            Sua conta está aguardando ativação. Após a confirmação do seu
            acesso, você receberá um e-mail e poderá entrar na plataforma.
          </p>

          <div className="space-y-3 text-left mb-6">
            {[
              { icon: Mail, text: "Verifique seu e-mail para confirmações" },
              { icon: Clock, text: "Ativação em até 24 horas úteis" },
              { icon: CheckCircle, text: "Acesso liberado após confirmação de pagamento" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 pt-1">{item.text}</p>
              </div>
            ))}
          </div>

          <Link
            href="/login"
            className="block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Ir para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}