"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCalculations } from "@/hooks/useCalculations";
import {
  Calculator,
  TrendingUp,
  ArrowRight,
  DollarSign,
  Percent,
  Package,
  Loader2,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();
  const { calculations, loading } = useCalculations();

  // ── KPIs calculados a partir dos dados reais ──
  const totalCalculations = calculations.length;

  const averageMargin =
    totalCalculations > 0
      ? calculations.reduce((acc, c) => acc + c.result.realNetMargin, 0) /
        totalCalculations
      : 0;

  const topProduct =
    totalCalculations > 0
      ? calculations.reduce((prev, curr) =>
          curr.result.realNetMargin > prev.result.realNetMargin ? curr : prev
        )
      : null;

  const totalRevenue = calculations.reduce(
    (acc, c) => acc + c.result.suggestedPrice,
    0
  );

  const recentCalculations = calculations.slice(0, 5);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {user?.displayName?.split(" ")[0] ?? "Lojista"}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Aqui está um resumo dos seus cálculos de precificação.
        </p>
      </div>

      {/* KPIs */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total de cálculos */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                <Calculator className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {totalCalculations}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                Cálculos realizados
              </p>
              <p className="text-xs text-blue-600 font-medium mt-1">
                {totalCalculations === 0
                  ? "Nenhum ainda"
                  : `${recentCalculations.length} recentes`}
              </p>
            </div>

            {/* Margem média */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                <Percent className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {totalCalculations > 0
                  ? `${averageMargin.toFixed(1)}%`
                  : "—"}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">Margem média</p>
              <p
                className={`text-xs font-medium mt-1 ${
                  averageMargin >= 30
                    ? "text-green-600"
                    : averageMargin > 0
                    ? "text-yellow-600"
                    : "text-gray-400"
                }`}
              >
                {averageMargin >= 30
                  ? "Margem saudável ✓"
                  : averageMargin > 0
                  ? "Margem abaixo do ideal"
                  : "Sem dados ainda"}
              </p>
            </div>

            {/* Produto mais rentável */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <p
                className="text-lg font-bold text-gray-900 truncate"
                title={topProduct?.input.productName}
              >
                {topProduct ? topProduct.input.productName : "—"}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                Produto mais rentável
              </p>
              <p className="text-xs text-orange-600 font-medium mt-1">
                {topProduct
                  ? `Margem de ${topProduct.result.realNetMargin}%`
                  : "Sem dados ainda"}
              </p>
            </div>

            {/* Faturamento estimado */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {totalCalculations > 0
                  ? formatCurrency(totalRevenue)
                  : "—"}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                Soma dos preços calculados
              </p>
              <p className="text-xs text-purple-600 font-medium mt-1">
                {totalCalculations > 0
                  ? "Baseado nos preços sugeridos"
                  : "Sem dados ainda"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CTA Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <Calculator className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Novo cálculo de precificação
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    Defina o preço ideal do seu produto em segundos com nossa
                    calculadora inteligente.
                  </p>
                </div>
                <Link
                  href="/calculadora"
                  className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-5 py-3 rounded-xl hover:bg-blue-50 transition-colors mt-6 w-fit"
                >
                  Calcular agora
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Cálculos recentes reais */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  <h3 className="font-bold text-gray-900">
                    Cálculos Recentes
                  </h3>
                </div>
                <Link
                  href="/historico"
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Ver todos
                </Link>
              </div>

              {/* Vazio */}
              {recentCalculations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                    <Calculator className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    Nenhum cálculo salvo ainda
                  </p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">
                    Faça seu primeiro cálculo para ver o resumo aqui
                  </p>
                  <Link
                    href="/calculadora"
                    className="text-sm text-blue-600 font-semibold hover:underline"
                  >
                    Ir para a calculadora →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recentCalculations.map((calc) => (
                    <div
                      key={calc.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {calc.input.productName}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {calc.createdAt instanceof Date
                            ? calc.createdAt.toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">
                            {formatCurrency(calc.result.suggestedPrice)}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 ${
                              calc.result.realNetMargin >= 30
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            <TrendingUp className="w-3 h-3" />
                            {calc.result.realNetMargin}%
                          </span>
                        </div>
                        <Link
                          href="/historico"
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver no histórico"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}