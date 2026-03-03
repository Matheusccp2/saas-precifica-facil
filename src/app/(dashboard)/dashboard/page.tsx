"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCalculations } from "@/hooks/useCalculations";
import { Calculator, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { RecentCalculations } from "@/components/dashboard/RecentCalculations";

export default function DashboardPage() {
  const { user } = useAuth();
  const { calculations, loading } = useCalculations();

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {user?.displayName?.split(" ")[0] ?? "Lojista"}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Aqui está um resumo dos seus cálculos de precificação.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <DashboardMetrics calculations={calculations} />

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
                  className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-5 py-3 rounded-xl hover:bg-blue-50 transition-colors mt-6 w-fit"
                >
                  Calcular agora
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Cálculos recentes reais */}
            <RecentCalculations calculations={calculations} />
          </div>
        </>
      )}
    </div>
  );
}