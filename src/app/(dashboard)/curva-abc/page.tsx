"use client";

import { useMemo, useState } from "react";
import { useCalculations } from "@/hooks/useCalculations";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Package,
  Loader2,
  Info,
  Trophy,
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { SavedCalculation } from "@/types";

type ABCClass = "A" | "B" | "C";

interface ABCProduct {
  calc: SavedCalculation;
  grossProfit: number;
  grossProfitPercent: number;
  cumulativePercent: number;
  class: ABCClass;
}

function buildABC(calculations: SavedCalculation[]): ABCProduct[] {
  if (calculations.length === 0) return [];

  // Agrupa por nome de produto (mais recente de cada)
  const byProduct = new Map<string, SavedCalculation>();
  calculations.forEach((c) => {
    const existing = byProduct.get(c.input.productName);
    if (!existing || c.createdAt > existing.createdAt) {
      byProduct.set(c.input.productName, c);
    }
  });

  const products = Array.from(byProduct.values());

  // Ordena pelo lucro bruto (maior → menor)
  const sorted = products
    .map((c) => ({ calc: c, grossProfit: c.result.grossProfit }))
    .sort((a, b) => b.grossProfit - a.grossProfit);

  const totalProfit = sorted.reduce((acc, p) => acc + p.grossProfit, 0);

  let cumulative = 0;
  return sorted.map((p) => {
    cumulative += p.grossProfit;
    const cumulativePercent = totalProfit > 0 ? (cumulative / totalProfit) * 100 : 0;
    const grossProfitPercent = totalProfit > 0 ? (p.grossProfit / totalProfit) * 100 : 0;

    const abcClass: ABCClass =
      cumulativePercent <= 80 ? "A" : cumulativePercent <= 95 ? "B" : "C";

    return {
      calc: p.calc,
      grossProfit: p.grossProfit,
      grossProfitPercent,
      cumulativePercent,
      class: abcClass,
    };
  });
}

const classConfig = {
  A: {
    label: "Classe A",
    color: "text-green-700",
    bg: "bg-green-100",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
    bar: "#22c55e",
    icon: Trophy,
    description: "Produtos essenciais — geram 80% do lucro",
    tip: "Mantenha estoque sempre abastecido e negocie melhores preços com fornecedores.",
  },
  B: {
    label: "Classe B",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    bar: "#3b82f6",
    icon: TrendingUp,
    description: "Produtos importantes — geram 15% do lucro",
    tip: "Monitore de perto. Podem subir para classe A com estratégia certa.",
  },
  C: {
    label: "Classe C",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    bar: "#f97316",
    icon: AlertTriangle,
    description: "Produtos secundários — geram 5% do lucro",
    tip: "Avalie se vale manter. Considere descontinuar ou revisar a precificação.",
  },
};

// ─────────────────────────────────────────────
// Tooltip customizado do gráfico
// ─────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 text-xs">
      <p className="font-bold text-gray-900 mb-1 max-w-[160px] truncate">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.name === "Lucro (R$)" ? formatCurrency(p.value) : `${p.value.toFixed(1)}%`}
        </p>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Linha da tabela expansível
// ─────────────────────────────────────────────
function ProductRow({ product, rank }: { product: ABCProduct; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = classConfig[product.class];
  const { input, result } = product.calc;

  return (
    <>
      <tr
        className="hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="px-6 py-4">
          <span className="text-sm font-bold text-gray-500">#{rank}</span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.badge}`}
            >
              {product.class}
            </span>
            <p className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">
              {input.productName}
            </p>
          </div>
        </td>
        <td className="px-6 py-4 text-sm font-bold text-gray-900">
          {formatCurrency(result.suggestedPrice)}
        </td>
        <td className="px-6 py-4 text-sm font-bold text-gray-900">
          {formatCurrency(product.grossProfit)}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-[80px]">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${Math.min(product.grossProfitPercent, 100)}%`,
                  backgroundColor: cfg.bar,
                }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {product.grossProfitPercent.toFixed(1)}%
            </span>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-600">
          {product.cumulativePercent.toFixed(1)}%
        </td>
        <td className="px-6 py-4">
          <span className={`text-xs font-medium ${result.realNetMargin >= 30 ? "text-green-600" : "text-yellow-600"}`}>
            {result.realNetMargin}%
          </span>
        </td>
        <td className="px-6 py-4">
          <button className="text-gray-400 hover:text-gray-600 p-1">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </td>
      </tr>

      {/* Linha expandida com detalhes */}
      {expanded && (
        <tr className={`${cfg.bg}`}>
          <td colSpan={8} className="px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Custo de Aquisição</p>
                <p className="text-sm font-bold text-gray-900">{formatCurrency(input.acquisitionCost)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Frete</p>
                <p className="text-sm font-bold text-gray-900">{formatCurrency(input.shippingCost)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Embalagem</p>
                <p className="text-sm font-bold text-gray-900">{formatCurrency(input.packagingCost)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Markup</p>
                <p className="text-sm font-bold text-gray-900">{result.markup}x</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Custo Total do Produto</p>
                <p className="text-sm font-bold text-gray-900">{formatCurrency(result.productCost)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Despesas Variáveis</p>
                <p className="text-sm font-bold text-gray-900">{formatCurrency(result.variableExpenses)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Imposto sobre Venda</p>
                <p className="text-sm font-bold text-gray-900">{formatCurrency(result.saleTax)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Margem Líquida Real</p>
                <p className={`text-sm font-bold ${result.realNetMargin >= 30 ? "text-green-600" : "text-yellow-600"}`}>
                  {result.realNetMargin}%
                </p>
              </div>
            </div>

            {/* Dica da classe */}
            <div className={`mt-3 flex items-start gap-2 p-3 rounded-xl border ${cfg.border} bg-white/60`}>
              <Info className={`w-4 h-4 flex-shrink-0 mt-0.5 ${cfg.color}`} />
              <p className={`text-xs font-medium ${cfg.color}`}>{cfg.tip}</p>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────
export default function CurvaABCPage() {
  const { calculations, loading } = useCalculations();
  const [activeFilter, setActiveFilter] = useState<ABCClass | "ALL">("ALL");

  const abcProducts = useMemo(() => buildABC(calculations), [calculations]);

  const classA = abcProducts.filter((p) => p.class === "A");
  const classB = abcProducts.filter((p) => p.class === "B");
  const classC = abcProducts.filter((p) => p.class === "C");

  const filtered =
    activeFilter === "ALL"
      ? abcProducts
      : abcProducts.filter((p) => p.class === activeFilter);

  // Dados para o gráfico de barras
  const barData = abcProducts.slice(0, 15).map((p) => ({
    name:
      p.calc.input.productName.length > 14
        ? p.calc.input.productName.slice(0, 14) + "…"
        : p.calc.input.productName,
    "Lucro (R$)": parseFloat(p.grossProfit.toFixed(2)),
    "% Acumulado": parseFloat(p.cumulativePercent.toFixed(1)),
    class: p.class,
  }));

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // ── Sem dados ──
  if (abcProducts.length === 0) {
    return (
      <div className="p-8 text-center py-32">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Sem produtos para classificar
        </h2>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          Salve pelo menos um cálculo na calculadora para gerar sua Curva ABC.
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

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Curva ABC</h1>
          <p className="text-gray-600 mt-1">
            Classificação dos seus produtos por contribuição no lucro
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <p className="text-xs text-blue-700 font-medium">
            Baseado no lucro bruto de cada produto
          </p>
        </div>
      </div>

      {/* Cards resumo A / B / C */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["A", "B", "C"] as ABCClass[]).map((cls) => {
          const items = cls === "A" ? classA : cls === "B" ? classB : classC;
          const cfg = classConfig[cls];
          const totalProfit = items.reduce((acc, p) => acc + p.grossProfit, 0);
          const Icon = cfg.icon;

          return (
            <div
              key={cls}
              className={`rounded-2xl border p-5 ${cfg.bg} ${cfg.border} cursor-pointer transition-all hover:shadow-md ${activeFilter === cls ? "ring-2 ring-offset-2 ring-current" : ""}`}
              onClick={() =>
                setActiveFilter((prev) => (prev === cls ? "ALL" : cls))
              }
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm`}>
                  <Icon className={`w-5 h-5 ${cfg.color}`} />
                </div>
                <span className={`text-2xl font-black ${cfg.color}`}>{cls}</span>
              </div>
              <p className={`text-xl font-bold ${cfg.color}`}>
                {items.length} produto{items.length !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">{cfg.description}</p>
              <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                <p className="text-xs text-gray-500">Lucro total combinado</p>
                <p className={`text-sm font-bold ${cfg.color}`}>
                  {formatCurrency(totalProfit)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Barras de lucro por produto */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-1">
            Lucro Bruto por Produto
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Top {Math.min(abcProducts.length, 15)} produtos ordenados por lucro
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `R$${v}`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Lucro (R$)" radius={[0, 6, 6, 0]}>
                {barData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={classConfig[entry.class as ABCClass].bar}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Curva acumulada */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-1">
            Curva de Pareto (% Acumulado)
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Visualização da concentração de lucro
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} angle={-30} textAnchor="end" height={48} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="% Acumulado"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Linhas de referência */}
          <div className="mt-3 flex gap-4 justify-center">
            {[
              { color: "bg-green-500", label: "A: até 80%" },
              { color: "bg-blue-500", label: "B: 80–95%" },
              { color: "bg-orange-500", label: "C: 95–100%" },
            ].map((ref) => (
              <div key={ref.label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full ${ref.color}`} />
                <span className="text-xs text-gray-600">{ref.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros da tabela */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-500 mr-1">Filtrar:</span>
        {(["ALL", "A", "B", "C"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
              activeFilter === f
                ? f === "ALL"
                  ? "bg-gray-900 text-white border-gray-900"
                  : f === "A"
                  ? "bg-green-600 text-white border-green-600"
                  : f === "B"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {f === "ALL" ? `Todos (${abcProducts.length})` : `Classe ${f} (${f === "A" ? classA.length : f === "B" ? classB.length : classC.length})`}
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-12">
                #
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Preço
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Lucro Bruto
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                % do Total
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                % Acumulado
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Margem
              </th>
              <th className="w-10 px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((product, i) => (
              <ProductRow
                key={product.calc.id}
                product={product}
                rank={abcProducts.indexOf(product) + 1}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Legenda explicativa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["A", "B", "C"] as ABCClass[]).map((cls) => {
          const cfg = classConfig[cls];
          const Icon = cfg.icon;
          return (
            <div key={cls} className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${cfg.color}`} />
                <span className={`text-sm font-bold ${cfg.color}`}>{cfg.label}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{cfg.tip}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}