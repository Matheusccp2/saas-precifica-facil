"use client";

import { Calculator, Save, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { PricingResult } from "@/types";

interface PricingResultCardProps {
  result: PricingResult | null;
  saving: boolean;
  onSave: () => void;
}

export function PricingResultCard({
  result,
  saving,
  onSave,
}: PricingResultCardProps) {
  return (
    <div className="p-6">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
        Resultados do Cálculo
      </p>

      {!result ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <Calculator className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">
            Preencha os dados e clique em "Calcular" para ver os resultados
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center py-4">
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Preço de Venda Sugerido:
            </p>
            <p className="text-4xl font-bold text-gray-900">
              {formatCurrency(result.suggestedPrice)}
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                label: "Custo do Produto",
                value: result.productCost,
                percent: result.productCostPercent,
                color: "bg-orange-500",
                textColor: "text-orange-600",
              },
              {
                label: "Despesas Variáveis",
                value: result.variableExpenses,
                percent: result.variableExpensesPercent,
                color: "bg-yellow-400",
                textColor: "text-yellow-600",
              },
              {
                label: "Lucro Bruto",
                value: result.grossProfit,
                percent: result.grossProfitPercent,
                color: "bg-green-500",
                textColor: "text-green-600",
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className={`font-semibold ${item.textColor}`}>
                      {item.label}:
                    </span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(item.value)}{" "}
                    <span className="text-gray-400 font-normal text-xs">
                      ({item.percent.toFixed(0)}%)
                    </span>
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-700`}
                    style={{ width: `${Math.min(item.percent, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Markup:</span>
              <span className="font-bold">{result.markup}x</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Impostos sobre Venda (Simples):
              </span>
              <span className="font-bold">
                {formatCurrency(result.saleTax)} ({result.saleTaxPercent}%)
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Margem Líquida Real:</span>
              <span className="font-bold text-green-600">
                {result.realNetMargin}%
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
            <p className="text-sm font-bold text-blue-800">
              Para ter um lucro líquido de {result.realNetMargin}%, venda a{" "}
              {formatCurrency(result.suggestedPrice)}
            </p>
          </div>

          <button
            onClick={onSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 border-2 border-blue-200 text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Salvando..." : "Salvar no histórico"}
          </button>
        </div>
      )}
    </div>
  );
}
