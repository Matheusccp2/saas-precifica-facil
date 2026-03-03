"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getReportData } from "@/lib/firestore";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Package,
  Calculator,
  BarChart3,
  Loader2,
  AlertCircle,
  Trophy,
  ArrowDown,
} from "lucide-react";
import Link from "next/link";

const COLORS = ["#ef4444", "#f97316", "#3b82f6", "#22c55e"];

export default function RelatoriosPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Awaited<
    ReturnType<typeof getReportData>
  > | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getReportData(user.uid).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!data || data.totalCalculations === 0) {
    return (
      <div className="p-8 text-center py-32">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Sem dados para exibir
        </h2>
        <p className="text-gray-500 mb-6">
          Faça pelo menos um cálculo e salve-o para ver os relatórios.
        </p>
        <Link
          href="/calculadora"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Ir para a Calculadora
        </Link>
      </div>
    );
  }

  const kpis = [
    {
      label: "Total de Cálculos",
      value: String(data.totalCalculations),
      icon: Calculator,
      color: "blue",
    },
    {
      label: "Margem Média",
      value: `${data.averageMargin}%`,
      icon: TrendingUp,
      color: "green",
    },
    {
      label: "Markup Médio",
      value: `${data.averageMarkup}x`,
      icon: BarChart3,
      color: "orange",
    },
    {
      label: "Maior Margem",
      value: data.topProduct ? `${data.topProduct.result.realNetMargin}%` : "—",
      icon: Trophy,
      color: "purple",
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600 mt-1">
          Análise completa dos seus cálculos de precificação
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                k.color === "blue"
                  ? "bg-blue-100"
                  : k.color === "green"
                    ? "bg-green-100"
                    : k.color === "orange"
                      ? "bg-orange-100"
                      : "bg-purple-100"
              }`}
            >
              <k.icon
                className={`w-5 h-5 ${
                  k.color === "blue"
                    ? "text-blue-600"
                    : k.color === "green"
                      ? "text-green-600"
                      : k.color === "orange"
                        ? "text-orange-600"
                        : "text-purple-600"
                }`}
              />
            </div>
            <p className="text-2xl font-bold text-gray-900">{k.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolução mensal */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-1">Evolução Mensal</h3>
          <p className="text-xs text-gray-500 mb-4">
            Cálculos e margem média nos últimos 6 meses
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.evolutionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11 }}
              />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="calculos"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Cálculos"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="margemMedia"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Margem %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição por margem */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-1">
            Distribuição por Faixa de Margem
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Quantos produtos por faixa de margem líquida
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.marginDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" name="Produtos" radius={[6, 6, 0, 0]}>
                {data.marginDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top / Lowest products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-gray-900">Top 5 Maior Margem</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {data.topProducts.map((calc, i) => (
              <div
                key={calc.id}
                className="flex items-center justify-between px-6 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0
                        ? "bg-yellow-100 text-yellow-700"
                        : i === 1
                          ? "bg-gray-100 text-gray-600"
                          : "bg-orange-50 text-orange-600"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {calc.input.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(calc.result.suggestedPrice)}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-600">
                  {calc.result.realNetMargin}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Destaques */}
        <div className="space-y-4">
          {data.topProduct && (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <p className="font-bold text-green-800">
                  Produto mais rentável
                </p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {data.topProduct.input.productName}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Preço: {formatCurrency(data.topProduct.result.suggestedPrice)} ·
                Margem: {data.topProduct.result.realNetMargin}%
              </p>
            </div>
          )}
          {data.lowestMarginProduct && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <ArrowDown className="w-5 h-5 text-red-500" />
                <p className="font-bold text-red-800">
                  Produto com menor margem
                </p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {data.lowestMarginProduct.input.productName}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Preço:{" "}
                {formatCurrency(data.lowestMarginProduct.result.suggestedPrice)}{" "}
                · Margem: {data.lowestMarginProduct.result.realNetMargin}%
              </p>
              <div className="mt-3 flex items-start gap-2 bg-white rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">
                  Considere revisar os custos ou aumentar a margem desejada para
                  este produto.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
