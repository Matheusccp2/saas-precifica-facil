"use client";

import { Search, Filter, Download, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const mockHistory = [
  { id: 1, name: "Camiseta Algodão Básica", acquisitionCost: 35.00, suggestedPrice: 78.90, margin: 29, date: "02/01/2025 14:32" },
  { id: 2, name: "Calça Jeans Slim", acquisitionCost: 89.00, suggestedPrice: 189.90, margin: 35, date: "02/01/2025 11:15" },
  { id: 3, name: "Tênis Casual Urban", acquisitionCost: 120.00, suggestedPrice: 249.00, margin: 40, date: "01/01/2025 16:48" },
  { id: 4, name: "Blusa Linho Premium", acquisitionCost: 65.00, suggestedPrice: 134.90, margin: 38, date: "01/01/2025 09:21" },
  { id: 5, name: "Bermuda Tactel", acquisitionCost: 42.00, suggestedPrice: 89.90, margin: 32, date: "31/12/2024 15:10" },
];

export default function HistoricoPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Histórico de Cálculos</h1>
          <p className="text-gray-600 mt-1">Todos os seus cálculos salvos</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produto..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 border border-gray-200 px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Produto</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Custo</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Preço Sugerido</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Margem Líquida</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockHistory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatCurrency(item.acquisitionCost)}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(item.suggestedPrice)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    item.margin >= 35 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {item.margin >= 35 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {item.margin}%
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
