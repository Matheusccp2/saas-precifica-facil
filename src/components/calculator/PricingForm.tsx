"use client";

import { UseFormReturn } from "react-hook-form";
import { Calculator, Info } from "lucide-react";
import { z } from "zod";

export const pricingSchema = z.object({
  productName: z.string().min(1, "Informe o nome do produto"),
  acquisitionCost: z.coerce.number().min(0.01, "Custo deve ser maior que zero"),
  shippingCost: z.coerce.number().min(0),
  packagingCost: z.coerce.number().min(0),
  purchaseTax: z.coerce.number().min(0).max(100),
  operationalCosts: z.coerce.number().min(0).max(100),
  cardFeeRate: z.coerce.number().min(0).max(100),
  desiredMargin: z.coerce.number().min(1).max(99),
  marketplaceCosts: z.coerce.number().min(0).max(100),
});

export type PricingFormData = z.infer<typeof pricingSchema>;

interface PricingFormProps {
  form: UseFormReturn<PricingFormData>;
  onSubmit: (data: PricingFormData) => void;
}

export function PricingForm({ form, onSubmit }: PricingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const Field = ({
    label,
    name,
    prefix,
    suffix,
    tooltip,
  }: {
    label: string;
    name: keyof PricingFormData;
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
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            {prefix}
          </span>
        )}
        <input
          {...register(name)}
          type="number"
          step="0.01"
          className={`w-full py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm ${prefix ? "pl-10 pr-4" : suffix ? "pl-4 pr-10" : "px-4"} ${errors[name] ? "border-red-300" : "border-gray-200"}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 space-y-4 border-r border-gray-100"
    >
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
        Entrada de Dados
      </p>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Nome do Produto
        </label>
        <input
          {...register("productName")}
          placeholder="Ex: Camiseta Algodão Básica"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.productName && (
          <p className="mt-1 text-xs text-red-500">
            {errors.productName.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Custo de Aquisição (R$)"
          name="acquisitionCost"
          prefix="R$"
          tooltip="Custo de compra do produto"
        />
        <Field
          label="Frete (R$)"
          name="shippingCost"
          prefix="R$"
          tooltip="Custo do envio do fornecedor"
        />
      </div>
      <Field
        label="Embalagem (R$)"
        name="packagingCost"
        prefix="R$"
        tooltip="Custo da embalagem"
      />
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Impostos na Compra (%)"
          name="purchaseTax"
          suffix="%"
          tooltip="ICMS, IPI e outros"
        />
        <Field
          label="Taxa da Maquininha (%)"
          name="cardFeeRate"
          suffix="%"
          tooltip="Taxa cobrada pela operadora do cartão (débito/crédito/PIX)"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Custos Operacionais (%)"
          name="operationalCosts"
          suffix="%"
          tooltip="Comissões, marketplace"
        />
        <Field
          label="Custos Marketplace (R$)"
          name="marketplaceCosts"
          suffix="R$"
          tooltip="Comissões, marketplace"
        />

      </div>
      <Field
        label="Margem de Lucro Desejada (%)"
        name="desiredMargin"
        suffix="%"
        tooltip="Percentual de lucro desejado"
      />
      <button
        type="submit"
        className="w-full bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-sm tracking-wide"
      >
        <Calculator className="w-5 h-5" /> CALCULAR PREÇO DE VENDA
      </button>
    </form>
  );
}
