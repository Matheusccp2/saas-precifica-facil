"use client";

import {
  Calculator,
  Percent,
  Package,
  DollarSign,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { SavedCalculation } from "@/types";

interface DashboardMetricsProps {
  calculations: SavedCalculation[];
}

export function DashboardMetrics({ calculations }: DashboardMetricsProps) {
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

  const recentCalculationsAmount = Math.min(calculations.length, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total de cálculos */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
          <Calculator className="w-5 h-5 text-blue-600" />
        </div>
        <p className="text-2xl font-bold text-gray-900">{totalCalculations}</p>
        <p className="text-sm text-gray-500 mt-0.5">Cálculos realizados</p>
        <p className="text-xs text-blue-600 font-medium mt-1">
          {totalCalculations === 0
            ? "Nenhum ainda"
            : `${recentCalculationsAmount} recentes`}
        </p>
      </div>

      {/* Margem média */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
          <Percent className="w-5 h-5 text-green-600" />
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {totalCalculations > 0 ? `${averageMargin.toFixed(1)}%` : "—"}
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
        <p className="text-sm text-gray-500 mt-0.5">Produto mais rentável</p>
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
          {totalCalculations > 0 ? formatCurrency(totalRevenue) : "—"}
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
  );
}
