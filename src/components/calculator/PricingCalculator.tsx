"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calculator, RotateCcw } from "lucide-react";

import { PricingInput, PricingResult } from "@/types";
import { useCalculations } from "@/hooks/useCalculations";
import { calculatePrice } from "@/lib/calculations";
import {
  PricingForm,
  PricingFormData,
  pricingSchema,
} from "@/components/calculator/PricingForm";
import { PricingResultCard } from "@/components/calculator/PricingResultCard";

export default function PricingCalculator() {
  const [result, setResult] = useState<PricingResult | null>(null);
  const [lastInput, setLastInput] = useState<PricingInput | null>(null);
  const [saving, setSaving] = useState(false);
  const { save } = useCalculations();

  const form = useForm<PricingFormData>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      productName: "",
      acquisitionCost: 0,
      shippingCost: 0,
      packagingCost: 0,
      purchaseTax: 0,
      operationalCosts: 15,
      cardFeeRate: 2.99,
      desiredMargin: 40,
    },
  });

  const onSubmit = (data: PricingFormData) => {
    const r = calculatePrice(data);
    setResult(r);
    setLastInput(data);
  };

  const handleSave = async () => {
    if (!lastInput || !result) return;
    setSaving(true);
    await save(lastInput, result);
    setSaving(false);
  };

  const handleReset = () => {
    form.reset();
    setResult(null);
    setLastInput(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Calculator className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">
              Calculadora de Precificação
            </h2>
            <p className="text-xs text-gray-500">
              Os dados são salvos automaticamente no banco
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <RotateCcw className="w-4 h-4" /> Limpar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <PricingForm form={form} onSubmit={onSubmit} />
        <PricingResultCard
          result={result}
          saving={saving}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
