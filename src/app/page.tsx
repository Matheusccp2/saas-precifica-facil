"use client";

import Link from "next/link";
import {
  BarChart3,
  CheckCircle,
  ShieldCheck,
  TrendingUp,
  Calculator,
  ArrowRight,
  Star,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-gray-900">Precifica</span>
                <span className="text-blue-600">Fácil</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#funcionalidades"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                Funcionalidades
              </a>
              <a
                href="#planos"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                Planos
              </a>
              <a
                href="#depoimentos"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                Depoimentos
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-200 transition-all"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Cadastre-se Grátis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4 fill-blue-500" />
              Mais de 2.000 lojistas já precificam com inteligência
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Calculadora de Precificação{" "}
              <span className="text-blue-600">Inteligente</span> — Defina seus
              Preços e{" "}
              <span className="text-green-500">Aumente seus Lucros!</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Calcule rapidamente o preço de venda ideal com base em custos,
              impostos e margem desejada. Nunca mais venda no prejuízo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cadastro"
                className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-green-600 transition-colors text-lg shadow-lg shadow-green-200"
              >
                Começar Gratuitamente
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#funcionalidades"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-colors text-lg"
              >
                Ver funcionalidades
              </a>
            </div>
          </div>

          {/* Calculator Preview */}
          <div className="mt-16 bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-4xl mx-auto p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Inputs preview */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                  Entrada de Dados
                </p>
                <div className="space-y-3">
                  {[
                    {
                      label: "Nome do Produto",
                      value: "Camiseta Algodão Básica",
                    },
                    { label: "Custo de Aquisição (R$)", value: "35,00" },
                    { label: "Frete (R$)", value: "5,50" },
                    { label: "Margem de Lucro (%)", value: "40,00" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="text-xs text-gray-500 block mb-1">
                        {field.label}
                      </label>
                      <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 text-sm">
                        {field.value}
                      </div>
                    </div>
                  ))}
                  <button className="w-full bg-green-500 text-white font-bold py-3 rounded-xl text-sm mt-2">
                    CALCULAR PREÇO DE VENDA
                  </button>
                </div>
              </div>

              {/* Result preview */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                  Resultados do Cálculo
                </p>
                <div className="text-center mb-4">
                  <p className="text-sm font-semibold text-gray-600">
                    Preço de Venda Sugerido:
                  </p>
                  <p className="text-4xl font-bold text-gray-900">R$ 78,90</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-orange-600">
                        Custo do Produto
                      </span>
                      <span className="font-bold">R$ 42,50 (54%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: "54%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-yellow-600">
                        Despesas Variáveis
                      </span>
                      <span className="font-bold">R$ 9,20 (11%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: "11%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-green-600">
                        Lucro Bruto
                      </span>
                      <span className="font-bold">R$ 31,56 (40%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "40%" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 text-center text-sm font-semibold text-blue-700">
                  Para ter um lucro líquido de 29%, venda a R$ 78,90
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para{" "}
              <span className="text-blue-600">precificar com segurança</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas profissionais para lojistas que querem crescer com
              margem saudável.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Calculator,
                color: "blue",
                title: "Custos Precisos",
                desc: "Inclua todos os custos: aquisição, frete, embalagem e operacionais.",
              },
              {
                icon: ShieldCheck,
                color: "green",
                title: "Margem Segura",
                desc: "Defina a margem desejada e saiba exatamente quanto vai ganhar.",
              },
              {
                icon: TrendingUp,
                color: "orange",
                title: "Lucratividade",
                desc: "Visualize markup real, impostos e margem líquida em segundos.",
              },
              {
                icon: BarChart3,
                color: "purple",
                title: "Histórico e Relatórios",
                desc: "Salve seus cálculos e acesse relatórios detalhados a qualquer hora.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    f.color === "blue"
                      ? "bg-blue-100"
                      : f.color === "green"
                        ? "bg-green-100"
                        : f.color === "orange"
                          ? "bg-orange-100"
                          : "bg-purple-100"
                  }`}
                >
                  <f.icon
                    className={`w-6 h-6 ${
                      f.color === "blue"
                        ? "text-blue-600"
                        : f.color === "green"
                          ? "text-green-600"
                          : f.color === "orange"
                            ? "text-orange-600"
                            : "text-purple-600"
                    }`}
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Planos simples e transparentes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Básico",
                price: "R$ 29",
                period: "/mês",
                features: [
                  "50 cálculos/mês",
                  "Histórico 30 dias",
                  "Exportar PDF",
                ],
                cta: "Começar",
                highlighted: false,
              },
              {
                name: "Pro",
                price: "R$ 59",
                period: "/mês",
                features: [
                  "Cálculos ilimitados",
                  "Histórico completo",
                  "Exportar Excel/PDF",
                  "Relatórios avançados",
                  "Suporte prioritário",
                ],
                cta: "Assinar Pro",
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "R$ 149",
                period: "/mês",
                features: [
                  "Tudo do Pro",
                  "Múltiplos usuários",
                  "API de integração",
                  "Treinamento incluso",
                  "SLA garantido",
                ],
                cta: "Falar com vendas",
                highlighted: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 ${
                  plan.highlighted
                    ? "bg-blue-600 text-white shadow-2xl shadow-blue-200 scale-105"
                    : "bg-white border border-gray-200"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-2 ${
                    plan.highlighted ? "text-white" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span
                    className={
                      plan.highlighted ? "text-blue-200" : "text-gray-500"
                    }
                  >
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle
                        className={`w-4 h-4 flex-shrink-0 ${
                          plan.highlighted ? "text-green-300" : "text-green-500"
                        }`}
                      />
                      <span
                        className={
                          plan.highlighted ? "text-blue-100" : "text-gray-600"
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/cadastro"
                  className={`block w-full text-center font-bold py-3 rounded-xl transition-colors ${
                    plan.highlighted
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Precifica<span className="text-blue-400">Fácil</span>
            </span>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} Precifica Fácil. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
