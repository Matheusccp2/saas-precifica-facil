"use client";

import { useState } from "react";
import { useCalculations } from "@/hooks/useCalculations";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  Trash2,
  TrendingUp,
  TrendingDown,
  Loader2,
  Calculator,
  Eye,
  X,
  Package,
  DollarSign,
  Percent,
  BarChart3,
  ShoppingCart,
  Truck,
  Box,
} from "lucide-react";
import Link from "next/link";
import { SavedCalculation } from "@/types";

// ─────────────────────────────────────────────
// Modal de visualização
// ─────────────────────────────────────────────
function CalcDetailModal({
  calc,
  onClose,
}: {
  calc: SavedCalculation;
  onClose: () => void;
}) {
  const { input, result } = calc;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calculator className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{input.productName}</h2>
              <p className="text-xs text-gray-500">
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
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Preço destaque */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white text-center">
            <p className="text-blue-200 text-sm font-medium mb-1">
              Preço de Venda Sugerido
            </p>
            <p className="text-5xl font-bold mb-3">
              {formatCurrency(result.suggestedPrice)}
            </p>
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-sm font-semibold">
              <TrendingUp className="w-4 h-4" />
              Margem líquida real: {result.realNetMargin}%
            </div>
          </div>

          {/* Dados de entrada */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              Dados Inseridos
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: ShoppingCart,
                  label: "Custo de Aquisição",
                  value: formatCurrency(input.acquisitionCost),
                  color: "blue",
                },
                {
                  icon: Truck,
                  label: "Frete",
                  value: formatCurrency(input.shippingCost),
                  color: "indigo",
                },
                {
                  icon: Box,
                  label: "Embalagem",
                  value: formatCurrency(input.packagingCost),
                  color: "purple",
                },
                {
                  icon: Percent,
                  label: "Impostos na Compra",
                  value: `${input.purchaseTax}%`,
                  color: "orange",
                },
                {
                  icon: BarChart3,
                  label: "Custos Operacionais",
                  value: `${input.operationalCosts}%`,
                  color: "yellow",
                },
                {
                  icon: TrendingUp,
                  label: "Margem Desejada",
                  value: `${input.desiredMargin}%`,
                  color: "green",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      item.color === "blue"
                        ? "bg-blue-100"
                        : item.color === "indigo"
                        ? "bg-indigo-100"
                        : item.color === "purple"
                        ? "bg-purple-100"
                        : item.color === "orange"
                        ? "bg-orange-100"
                        : item.color === "yellow"
                        ? "bg-yellow-100"
                        : "bg-green-100"
                    }`}
                  >
                    <item.icon
                      className={`w-4 h-4 ${
                        item.color === "blue"
                          ? "text-blue-600"
                          : item.color === "indigo"
                          ? "text-indigo-600"
                          : item.color === "purple"
                          ? "text-purple-600"
                          : item.color === "orange"
                          ? "text-orange-600"
                          : item.color === "yellow"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm font-bold text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribuição */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              Distribuição do Preço
            </p>
            <div className="space-y-3">
              {[
                {
                  label: "Custo do Produto",
                  value: result.productCost,
                  percent: result.productCostPercent,
                  bar: "bg-orange-500",
                  text: "text-orange-600",
                },
                {
                  label: "Despesas Variáveis",
                  value: result.variableExpenses,
                  percent: result.variableExpensesPercent,
                  bar: "bg-yellow-400",
                  text: "text-yellow-600",
                },
                {
                  label: "Lucro Bruto",
                  value: result.grossProfit,
                  percent: result.grossProfitPercent,
                  bar: "bg-green-500",
                  text: "text-green-600",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${item.bar}`} />
                      <span className={`font-semibold ${item.text}`}>
                        {item.label}
                      </span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(item.value)}{" "}
                      <span className="text-gray-400 font-normal text-xs">
                        ({item.percent.toFixed(0)}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`${item.bar} h-2.5 rounded-full transition-all duration-700`}
                      style={{ width: `${Math.min(item.percent, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumo financeiro */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              Resumo Financeiro
            </p>
            <div className="bg-gray-50 rounded-xl divide-y divide-gray-100">
              {[
                { label: "Markup", value: `${result.markup}x` },
                {
                  label: "Impostos sobre a Venda (Simples)",
                  value: `${formatCurrency(result.saleTax)} (${result.saleTaxPercent}%)`,
                },
                {
                  label: "Margem Líquida Real",
                  value: `${result.realNetMargin}%`,
                  highlight: true,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span
                    className={`text-sm font-bold ${
                      item.highlight ? "text-green-600" : "text-gray-900"
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Conclusão */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
            <p className="text-sm font-bold text-blue-800">
              Para ter um lucro líquido de {result.realNetMargin}%, venda a{" "}
              {formatCurrency(result.suggestedPrice)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────
export default function HistoricoPage() {
  const { calculations, loading, remove } = useCalculations();
  const [search, setSearch] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);
  const [viewing, setViewing] = useState<SavedCalculation | null>(null);

  const filtered = calculations.filter((c) =>
    c.input.productName.toLowerCase().includes(search.toLowerCase())
  );

  const handleRemove = async (id: string) => {
    if (!confirm("Deseja remover este cálculo?")) return;
    setRemoving(id);
    await remove(id);
    setRemoving(null);
  };

  return (
    <div className="p-8">
      {/* Modal */}
      {viewing && (
        <CalcDetailModal calc={viewing} onClose={() => setViewing(null)} />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Histórico de Cálculos
          </h1>
          <p className="text-gray-600 mt-1">
            {loading
              ? "Carregando..."
              : `${calculations.length} cálculo${calculations.length !== 1 ? "s" : ""} registrado${calculations.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Busca */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>

      /* Vazio */
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">
            {search ? "Nenhum produto encontrado" : "Nenhum cálculo salvo ainda"}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {search
              ? "Tente outro termo de busca"
              : "Faça seu primeiro cálculo e salve para ver aqui"}
          </p>
          {!search && (
            <Link
              href="/calculadora"
              className="inline-block mt-4 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Ir para a Calculadora
            </Link>
          )}
        </div>

      /* Tabela */
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Custo
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Preço Sugerido
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Margem Líquida
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((calc) => (
                <tr key={calc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900">
                      {calc.input.productName}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatCurrency(calc.input.acquisitionCost)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(calc.result.suggestedPrice)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        calc.result.realNetMargin >= 30
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {calc.result.realNetMargin >= 30 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {calc.result.realNetMargin}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {calc.createdAt instanceof Date
                      ? calc.createdAt.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* Visualizar */}
                      <button
                        onClick={() => setViewing(calc)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Visualizar cálculo"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Remover */}
                      <button
                        onClick={() => handleRemove(calc.id)}
                        disabled={removing === calc.id}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                        title="Remover cálculo"
                      >
                        {removing === calc.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}