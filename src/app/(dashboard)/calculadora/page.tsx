import PricingCalculator from "@/components/calculator/PricingCalculator";
import { Lightbulb } from "lucide-react";

export default function CalculadoraPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calculadora de Precificação</h1>
        <p className="text-gray-600 mt-1">
          Calcule o preço de venda ideal para seus produtos
        </p>
      </div>

      {/* Tip */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mb-6">
        <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Dica de precificação</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Lembre-se de incluir todos os custos, inclusive embalagem e frete, para ter uma margem
            real. Muitos lojistas esquecem despesas operacionais e vendem no prejuízo.
          </p>
        </div>
      </div>

      <PricingCalculator />
    </div>
  );
}