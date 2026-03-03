"use client";

import { useState } from "react";
import { useCalculations } from "@/hooks/useCalculations";
import { formatCurrency } from "@/lib/utils";
import { SavedCalculation } from "@/types";
import {
  Search,
  Trash2,
  TrendingUp,
  TrendingDown,
  Loader2,
  Calculator,
  Eye,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { EditModal } from "@/components/historico/EditModal";
import { CalcDetailModal } from "@/components/historico/CalcDetailModal";

export default function HistoricoPage() {
  const { calculations, loading, remove, update } = useCalculations();
  const [search, setSearch] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);
  const [viewing, setViewing] = useState<SavedCalculation | null>(null);
  const [editing, setEditing] = useState<SavedCalculation | null>(null);

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
    <div className="p-4 md:p-8">
      {/* Modais */}
      {viewing && (
        <CalcDetailModal calc={viewing} onClose={() => setViewing(null)} />
      )}
      {editing && (
        <EditModal
          calc={editing}
          onClose={() => setEditing(null)}
          onSave={update}
        />
      )}

      {/* Header */}
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

      {/* Search Bar */}
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

      {/* Tabela ou Empty State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">
            {search
              ? "Nenhum produto encontrado"
              : "Nenhum cálculo salvo ainda"}
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
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {[
                  "Produto",
                  "Custo",
                  "Preço Sugerido",
                  "Margem Líquida",
                  "Data",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((calc) => (
                <tr
                  key={calc.id}
                  className="hover:bg-gray-50 transition-colors"
                >
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
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${calc.result.realNetMargin >= 30 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
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
                      <button
                        onClick={() => setViewing(calc)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Visualizar cálculo"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setEditing(calc)}
                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Editar cálculo"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

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