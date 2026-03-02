import Link from "next/link";
import {
  Calculator,
  CheckCircle,
  ArrowRight,
  Shield,
  Star,
  MessageCircle,
  Lock,
} from "lucide-react";

export default function PlanosPage() {
  // Substitua pela URL do seu link de pagamento (Hotmart, Kiwify, Stripe, etc.)
  const PAYMENT_URL = "https://seulink.com/pagamento";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-gray-900">Precifica</span>
                <span className="text-blue-600">Fácil</span>
              </span>
            </Link>
            <Link
              href="/login"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              Já sou assinante → Entrar
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-bold px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 fill-green-500" />
            Oferta especial de lançamento
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Acesso completo por{" "}
            <span className="text-blue-600">menos de R$ 1/mês</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Um único plano com tudo que você precisa para precificar seus
            produtos com inteligência e nunca mais vender no prejuízo.
          </p>
        </div>

        {/* Card do plano */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
          {/* Banner topo */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-center">
            <p className="text-white font-bold text-sm tracking-widest uppercase">
              ✦ Plano Anual — Acesso Total ✦
            </p>
          </div>

          <div className="p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Preço */}
              <div className="text-center lg:text-left">
                <div className="flex items-end justify-center lg:justify-start gap-2 mb-2">
                  <span className="text-6xl font-black text-gray-900">R$9,90</span>
                  <span className="text-gray-500 text-lg mb-2">/ano</span>
                </div>
                <p className="text-green-600 font-semibold text-sm">
                  ✓ Equivale a R$ 0,82 por mês
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Cobrado uma vez por ano. Cancele quando quiser.
                </p>
              </div>

              {/* CTA */}
              <div className="flex flex-col items-center lg:items-end gap-3">
                <a
                  href={PAYMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all text-lg shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 w-full lg:w-auto"
                >
                  Assinar agora
                  <ArrowRight className="w-5 h-5" />
                </a>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Shield className="w-3.5 h-3.5 text-green-500" />
                  Pagamento 100% seguro
                </div>
              </div>
            </div>

            {/* Divisor */}
            <hr className="border-t border-gray-100 my-8" />

            {/* Funcionalidades */}
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-5">
                Tudo incluso no plano
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    title: "Calculadora Completa",
                    desc: "Custo, frete, embalagem, impostos, maquininha e margem",
                  },
                  {
                    title: "Taxa da Maquininha",
                    desc: "Inclua a taxa no cálculo e não perca margem no pagamento",
                  },
                  {
                    title: "Histórico Ilimitado",
                    desc: "Salve, visualize e edite todos os seus cálculos",
                  },
                  {
                    title: "Curva ABC",
                    desc: "Classifique produtos por lucratividade com gráficos",
                  },
                  {
                    title: "Relatórios e Gráficos",
                    desc: "Evolução da margem, distribuição e top produtos",
                  },
                  {
                    title: "Exportação de Dados",
                    desc: "Exporte seus dados a qualquer momento (LGPD)",
                  },
                  {
                    title: "Suporte via WhatsApp",
                    desc: "Atendimento humano para dúvidas e suporte técnico",
                  },
                  {
                    title: "Acesso em qualquer dispositivo",
                    desc: "Web, celular ou tablet — funciona em todos",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divisor */}
            <hr className="border-t border-gray-100 my-8" />

            {/* CTA final */}
            <div className="text-center">
              <a
                href={PAYMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-bold px-10 py-4 rounded-2xl hover:bg-green-600 transition-all text-lg shadow-lg shadow-green-200 hover:shadow-xl hover:-translate-y-0.5"
              >
                Quero assinar por R$ 9,90/ano
                <ArrowRight className="w-5 h-5" />
              </a>
              <p className="text-xs text-gray-400 mt-3">
                Após o pagamento, você receberá as instruções de acesso por e-mail.
              </p>
            </div>
          </div>
        </div>

        {/* Garantias */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: Shield,
              color: "text-green-600 bg-green-100",
              title: "Pagamento Seguro",
              desc: "Processado com criptografia SSL",
            },
            {
              icon: MessageCircle,
              color: "text-blue-600 bg-blue-100",
              title: "Suporte WhatsApp",
              desc: "Atendimento humano e rápido",
            },
            {
              icon: Lock,
              color: "text-purple-600 bg-purple-100",
              title: "Dados Protegidos",
              desc: "Em conformidade com a LGPD",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Dúvidas frequentes
          </h2>
          <div className="space-y-5">
            {[
              {
                q: "Como recebo o acesso após o pagamento?",
                a: "Após a confirmação do pagamento, você receberá um e-mail com as instruções de acesso em até 24 horas úteis.",
              },
              {
                q: "Posso cancelar a qualquer momento?",
                a: "Sim. Você pode solicitar o cancelamento a qualquer momento pelo suporte via WhatsApp. O acesso permanece ativo até o fim do período pago.",
              },
              {
                q: "Funciona no celular?",
                a: "Sim! O PrecificaFácil é totalmente responsivo e funciona em qualquer dispositivo — computador, tablet ou celular.",
              },
              {
                q: "O valor vai aumentar?",
                a: "Este é o preço de lançamento. Assinantes que entrarem agora mantêm o valor mesmo se o preço for reajustado no futuro.",
              },
            ].map((item) => (
              <div key={item.q} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                <p className="text-sm font-bold text-gray-900 mb-1">{item.q}</p>
                <p className="text-sm text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}