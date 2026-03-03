"use client";

import { SavedCalculation } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Calculator,
  X,
  TrendingUp,
  ShoppingCart,
  Truck,
  Box,
  Percent,
  BarChart3,
} from "lucide-react";

export function CalcDetailModal({
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
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-${item.color}-100`}
                  >
                    <item.icon className={`w-4 h-4 text-${item.color}-600`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm font-bold text-gray-900">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                      className={`${item.bar} h-2.5 rounded-full`}
                      style={{ width: `${Math.min(item.percent, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                  className={`text-sm font-bold ${item.highlight ? "text-green-600" : "text-gray-900"}`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

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
