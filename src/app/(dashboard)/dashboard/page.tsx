"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Calculator,
  TrendingUp,
  History,
  ArrowRight,
  DollarSign,
  Percent,
  Package,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

const stats = [
  {
    label: "Cálculos realizados",
    value: "24",
    icon: Calculator,
    color: "blue",
    change: "+3 esta semana",
  },
  {
    label: "Margem média",
    value: "38,5%",
    icon: Percent,
    color: "green",
    change: "+2,3% vs. mês passado",
  },
  {
    label: "Produto mais rentável",
    value: "Camiseta Basic",
    icon: Package,
    color: "orange",
    change: "Margem de 42%",
  },
  {
    label: "Faturamento estimado",
    value: "R$ 12.480",
    icon: DollarSign,
    color: "purple",
    change: "Baseado nos preços calculados",
  },
];

const recentCalcs = [
  { name: "Camiseta Algodão Básica", price: 78.90, margin: 29, date: "Hoje, 14:32" },
  { name: "Calça Jeans Slim", price: 189.90, margin: 35, date: "Hoje, 11:15" },
  { name: "Tênis Casual Urban", price: 249.00, margin: 40, date: "Ontem, 16:48" },
  { name: "Blusa Linho Premium", price: 134.90, margin: 38, date: "Ontem, 09:21" },
];

export default function DashboardPage() {
  const { user } = useAuth();

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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  stat.color === "blue" ? "bg-blue-100" :
                  stat.color === "green" ? "bg-green-100" :
                  stat.color === "orange" ? "bg-orange-100" : "bg-purple-100"
                }`}
              >
                <stat.icon className={`w-5 h-5 ${
                  stat.color === "blue" ? "text-blue-600" :
                  stat.color === "green" ? "text-green-600" :
                  stat.color === "orange" ? "text-orange-600" : "text-purple-600"
                }`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-xs text-green-600 font-medium mt-1">{stat.change}</p>
          </div>
        ))}
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
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-5 py-3 rounded-xl hover:bg-blue-50 transition-colors mt-4 w-fit"
            >
              Calcular agora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Recent calcs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-gray-400" />
              <h3 className="font-bold text-gray-900">Cálculos Recentes</h3>
            </div>
            <Link href="/historico" className="text-sm text-blue-600 hover:underline font-medium">
              Ver todos
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentCalcs.map((calc) => (
              <div key={calc.name} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{calc.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{calc.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(calc.price)}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full mt-0.5">
                    <TrendingUp className="w-3 h-3" />
                    {calc.margin}% margem
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}