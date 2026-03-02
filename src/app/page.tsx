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
  Lock,
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
                href="/planos"
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Adquirir Plano
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
              impostos, taxa da maquininha e margem desejada. Nunca mais venda
              no prejuízo.
            </p>

            {/* Aviso de acesso restrito */}
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium px-5 py-3 rounded-xl mb-8">
              <Lock className="w-4 h-4 flex-shrink-0" />
              Acesso exclusivo para assinantes — adquira seu plano para começar
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/planos"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors text-lg shadow-lg shadow-blue-200"
              >
                Ver Planos e Preços
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-colors text-lg"
              >
                Já sou assinante
              </Link>
            </div>
          </div>

          {/* Calculator Preview */}
          <div className="mt-16 bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-4xl mx-auto p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    { label: "Taxa da Maquininha (%)", value: "2,99" },
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
                  <div className="w-full bg-green-500 text-white font-bold py-3 rounded-xl text-sm text-center mt-2">
                    CALCULAR PREÇO DE VENDA
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                  Resultados do Cálculo
                </p>
                <div className="text-center mb-4">
                  <p className="text-sm font-semibold text-gray-600">
                    Preço de Venda Sugerido:
                  </p>
                  <p className="text-4xl font-bold text-gray-900">R$ 82,50</p>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      label: "Custo do Produto",
                      value: "R$ 42,50 (52%)",
                      color: "bg-orange-500",
                      width: "52%",
                    },
                    {
                      label: "Despesas Variáveis",
                      value: "R$ 9,20 (11%)",
                      color: "bg-yellow-400",
                      width: "11%",
                    },
                    {
                      label: "Lucro Bruto",
                      value: "R$ 30,80 (37%)",
                      color: "bg-green-500",
                      width: "37%",
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-gray-600">
                          {item.label}
                        </span>
                        <span className="font-bold">{item.value}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: item.width }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 text-center text-sm font-semibold text-blue-700">
                  Para ter lucro líquido de 29%, venda a R$ 82,50
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
                desc: "Inclua todos os custos: aquisição, frete, embalagem, taxa da maquininha e operacionais.",
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
                title: "Curva ABC",
                desc: "Classifique seus produtos por lucratividade e foque no que realmente importa.",
              },
              {
                icon: BarChart3,
                color: "purple",
                title: "Relatórios",
                desc: "Histórico completo com gráficos e análises detalhadas dos seus produtos.",
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

      {/* Planos */}
      <section id="planos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Um plano. Acesso completo.
            </h2>
            <p className="text-xl text-gray-600">
              Sem surpresas, sem planos confusos. Tudo incluso por um preço
              justo.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-green-400 text-green-900 text-xs font-bold px-3 py-1 rounded-full">
                MELHOR CUSTO-BENEFÍCIO
              </div>
              <h3 className="text-2xl font-bold mb-1">Plano Anual</h3>
              <p className="text-blue-200 text-sm mb-6">
                Acesso completo a todas as funcionalidades
              </p>
              <div className="mb-6">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold">R$ 9,90</span>
                  <span className="text-blue-200 mb-1">/ano</span>
                </div>
                <p className="text-blue-200 text-xs mt-1">
                  Menos de R$ 1,00 por mês
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Calculadora de precificação completa",
                  "Taxa da maquininha no cálculo",
                  "Histórico ilimitado de cálculos",
                  "Curva ABC dos produtos",
                  "Relatórios e gráficos",
                  "Exportação dos seus dados",
                  "Suporte via WhatsApp",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-300 flex-shrink-0" />
                    <span className="text-blue-100">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/planos"
                className="block w-full text-center font-bold py-4 rounded-xl bg-white text-blue-600 hover:bg-blue-50 transition-colors text-lg"
              >
                Assinar agora →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 text-sm font-medium px-4 py-2 rounded-full mb-4">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              Avaliação média de 4.9/5
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Lojistas que já{" "}
              <span className="text-blue-600">precificam com confiança</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Mariana Costa",
                role: "Loja de roupas femininas — SP",
                avatar: "MC",
                color: "bg-pink-100 text-pink-700",
                text: "Antes eu precificava no chute e vivia no sufoco. Com o PrecificaFácil descobri que estava vendendo algumas peças no prejuízo! Hoje minha margem média subiu de 18% para 34%.",
                highlight: "margem subiu de 18% para 34%",
              },
              {
                name: "Rafael Mendes",
                role: "E-commerce de eletrônicos — MG",
                avatar: "RM",
                color: "bg-blue-100 text-blue-700",
                text: "Trabalho com marketplace e os custos me matavam. Agora consigo incluir a taxa da maquininha e as comissões no cálculo e sei exatamente quanto vou lucrar antes de vender.",
                highlight: "sei exatamente quanto vou lucrar",
              },
              {
                name: "Fernanda Alves",
                role: "Papelaria e presentes — RJ",
                avatar: "FA",
                color: "bg-purple-100 text-purple-700",
                text: "Simples, rápido e preciso. Uso todos os dias para calcular novos produtos. A Curva ABC me ajudou a focar nos produtos mais rentáveis.",
                highlight: "uso todos os dias",
              },
              {
                name: "Carlos Eduardo",
                role: "Distribuidora de alimentos — RS",
                avatar: "CE",
                color: "bg-green-100 text-green-700",
                text: "Tentei várias planilhas mas sempre dava erro. O PrecificaFácil me guia em cada campo e os relatórios mostram uma visão geral do meu negócio que eu nunca tive.",
                highlight: "visão geral que nunca tive",
              },
              {
                name: "Juliana Rocha",
                role: "Boutique infantil — BA",
                avatar: "JR",
                color: "bg-orange-100 text-orange-700",
                text: "O suporte via WhatsApp é excelente! Em menos de 5 minutos já estava calculando meus preços. Recomendo para qualquer lojista.",
                highlight: "em menos de 5 minutos",
              },
              {
                name: "Bruno Takahashi",
                role: "Importados e utilidades — PR",
                avatar: "BT",
                color: "bg-indigo-100 text-indigo-700",
                text: "Por apenas R$ 9,90 por ano, o retorno é absurdo. Já evitei prejuízos de centenas de reais só na primeira semana de uso.",
                highlight: "R$ 9,90 por ano",
              },
            ].map((dep) => (
              <div
                key={dep.name}
                className="bg-gray-50 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed flex-1">
                  "
                  {dep.text.split(dep.highlight).map((part, i, arr) =>
                    i < arr.length - 1 ? (
                      <span key={i}>
                        {part}
                        <span className="font-semibold text-blue-600">
                          {dep.highlight}
                        </span>
                      </span>
                    ) : (
                      part
                    ),
                  )}
                  "
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${dep.color}`}
                  >
                    {dep.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {dep.name}
                    </p>
                    <p className="text-xs text-gray-500">{dep.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
            <div className="flex justify-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-3xl font-bold mb-1">4.9 / 5.0</p>
            <p className="text-blue-200 text-sm mb-6">
              Baseado em mais de 500 avaliações
            </p>
            <Link
              href="/planos"
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Quero precificar com confiança
              <ArrowRight className="w-4 h-4" />
            </Link>
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
            © 2024 PrecificaFácil. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
