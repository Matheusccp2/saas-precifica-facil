"use client";

import { Calculator, TrendingUp, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { SavedCalculation } from "@/types";

interface RecentCalculationsProps {
  calculations: SavedCalculation[];
}

export function RecentCalculations({ calculations }: RecentCalculationsProps) {
  const recentCalculations = calculations.slice(0, 5);

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-400" />
          <h3 className="font-bold text-gray-900">Cálculos Recentes</h3>
        </div>
        <Link
          href="/historico"
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          Ver todos
        </Link>
      </div>

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
  );
}
