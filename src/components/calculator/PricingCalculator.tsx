"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Calculator,
  Info,
  Save,
  RotateCcw,
  TrendingUp,
  Package,
  DollarSign,
} from "lucide-react";
import { PricingInput, PricingResult } from "@/types";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { toast } from "sonner";

const schema = z.object({
  productName: z.string().min(1, "Informe o nome do produto"),
  acquisitionCost: z.coerce.number().min(0.01, "Custo deve ser maior que zero"),
  shippingCost: z.coerce.number().min(0),
  packagingCost: z.coerce.number().min(0),
  purchaseTax: z.coerce.number().min(0).max(100),
  operationalCosts: z.coerce.number().min(0).max(100),
  desiredMargin: z.coerce.number().min(1, "Margem deve ser maior que 0").max(99),
});

type FormData = z.infer<typeof schema>;

function calculatePrice(input: PricingInput): PricingResult {
  const {
    acquisitionCost,
    shippingCost,
    packagingCost,
    purchaseTax,
    operationalCosts,
    desiredMargin,
  } = input;

  // Custo total do produto
  const taxAmount = (acquisitionCost * purchaseTax) / 100;
  const productCost = acquisitionCost + shippingCost + packagingCost + taxAmount;

  // Markup
  const markup = 1 / (1 - (desiredMargin + operationalCosts) / 100);
  const suggestedPrice = productCost * markup;

  // Despesas variáveis (custos operacionais sobre o preço de venda)
  const variableExpenses = (suggestedPrice * operationalCosts) / 100;

  // Imposto sobre a venda (Simples Nacional ~11%)
  const saleTaxPercent = 11;
  const saleTax = (suggestedPrice * saleTaxPercent) / 100;

  // Lucro bruto
  const grossProfit = suggestedPrice - productCost - variableExpenses;

  // Margem líquida real
  const realNetMargin = ((grossProfit - saleTax) / suggestedPrice) * 100;

  return {
    suggestedPrice,
    productCost,
    productCostPercent: (productCost / suggestedPrice) * 100,
    variableExpenses,
    variableExpensesPercent: (variableExpenses / suggestedPrice) * 100,
    grossProfit,
    grossProfitPercent: (grossProfit / suggestedPrice) * 100,
    markup: parseFloat(markup.toFixed(2)),
    saleTax,
    saleTaxPercent,
    realNetMargin: parseFloat(realNetMargin.toFixed(1)),
  };
}

export default function PricingCalculator() {
  const [result, setResult] = useState<PricingResult | null>(null);
  const [calculated, setCalculated] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      productName: "",
      acquisitionCost: 0,
      shippingCost: 0,
      packagingCost: 0,
      purchaseTax: 0,
      operationalCosts: 15,
      desiredMargin: 40,
    },
  });

  const onSubmit = (data: FormData) => {
    const r = calculatePrice(data);
    setResult(r);
    setCalculated(true);
  };

  const handleReset = () => {
    reset();
    setResult(null);
    setCalculated(false);
  };

  const handleSave = () => {
    toast.success("Cálculo salvo no histórico!");
  };

  const InputField = ({
    label,
    name,
    placeholder,
    prefix,
    suffix,
    tooltip,
  }: {
    label: string;
    name: keyof FormData;
    placeholder: string;
    prefix?: string;
    suffix?: string;
    tooltip?: string;
  }) => (
    <div>
      <div className="flex items-center gap-1 mb-1.5">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {tooltip && (
          <div className="relative group">
            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
            {prefix}
          </span>
        )}
        <input
          {...register(name)}
          type="number"
          step="0.01"
          placeholder={placeholder}
          className={`w-full py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm ${
            prefix ? "pl-10 pr-4" : suffix ? "pl-4 pr-10" : "px-4"
          } ${errors[name] ? "border-red-300 bg-red-50" : "border-gray-200"}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
            {suffix}
          </span>
        )}
      </div>
      {errors[name] && (
        <p className="mt-1 text-xs text-red-500">{errors[name]?.message}</p>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Calculator className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Calculadora de Precificação</h2>
            <p className="text-xs text-gray-500">Preencha os dados do produto</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Limpar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 border-r border-gray-100">
          <div className="pb-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
              Entrada de Dados
            </p>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Nome do Produto
              </label>
              <input
                {...register("productName")}
                type="text"
                placeholder="Ex: Camiseta Algodão Básica"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
              {errors.productName && (
                <p className="mt-1 text-xs text-red-500">{errors.productName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputField label="Custo de Aquisição (R$)" name="acquisitionCost" placeholder="35,00" prefix="R$" tooltip="Custo de compra do produto" />
            <InputField label="Frete (R$)" name="shippingCost" placeholder="5,50" prefix="R$" tooltip="Custo de envio do fornecedor" />
          </div>

          <InputField label="Embalagem (R$)" name="packagingCost" placeholder="2,00" prefix="R$" tooltip="Custo da embalagem do produto" />

          <div className="grid grid-cols-2 gap-3">
            <InputField label="Impostos na Compra (%)" name="purchaseTax" placeholder="8,00" suffix="%" tooltip="ICMS, IPI ou outros impostos na compra" />
            <InputField label="Custos Operacionais (%)" name="operationalCosts" placeholder="15,00" suffix="%" tooltip="Comissões, marketplace, etc" />
          </div>

          <InputField label="Margem de Lucro Desejada (%)" name="desiredMargin" placeholder="40,00" suffix="%" tooltip="Percentual de lucro que você deseja obter" />

          <button
            type="submit"
            className="w-full bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-sm tracking-wide mt-2"
          >
            <Calculator className="w-5 h-5" />
            CALCULAR PREÇO DE VENDA
          </button>
        </form>

        {/* Results */}
        <div className="p-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            Resultados do Cálculo
          </p>

          {!calculated ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <Calculator className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">
                Preencha os dados ao lado e clique em "Calcular" para ver os resultados
              </p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Price highlight */}
              <div className="text-center py-4">
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Preço de Venda Sugerido:
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {formatCurrency(result.suggestedPrice)}
                </p>
              </div>

              {/* Bars */}
              <div className="space-y-3">
                {[
                  {
                    label: "Custo do Produto",
                    value: result.productCost,
                    percent: result.productCostPercent,
                    color: "bg-orange-500",
                    textColor: "text-orange-600",
                    icon: Package,
                  },
                  {
                    label: "Despesas Variáveis",
                    value: result.variableExpenses,
                    percent: result.variableExpensesPercent,
                    color: "bg-yellow-400",
                    textColor: "text-yellow-600",
                    icon: DollarSign,
                  },
                  {
                    label: "Lucro Bruto",
                    value: result.grossProfit,
                    percent: result.grossProfitPercent,
                    color: "bg-green-500",
                    textColor: "text-green-600",
                    icon: TrendingUp,
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className={`font-semibold ${item.textColor}`}>{item.label}:</span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {formatCurrency(item.value)}{" "}
                        <span className="text-gray-500 font-normal text-xs">
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

              {/* Extra info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Markup:</span>
                  <span className="font-bold text-gray-900">{result.markup}x</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Impostos sobre a Venda (Simples):</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(result.saleTax)} ({result.saleTaxPercent}%)
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Margem Líquida Real:</span>
                  <span className="font-bold text-green-600">{result.realNetMargin}%</span>
                </div>
              </div>

              {/* Summary box */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                <p className="text-sm font-bold text-blue-800">
                  Para ter um lucro líquido de {result.realNetMargin}%, venda a{" "}
                  {formatCurrency(result.suggestedPrice)}
                </p>
              </div>

              {/* Save */}
              <button
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 border-2 border-blue-200 text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
              >
                <Save className="w-4 h-4" />
                Salvar no histórico
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}