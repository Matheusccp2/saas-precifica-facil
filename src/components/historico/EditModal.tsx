"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PricingInput, PricingResult, SavedCalculation } from "@/types";
import { Pencil, X, Save, Calculator, Loader2 } from "lucide-react";
import { calculatePrice } from "@/lib/calculations";

export const editSchema = z.object({
  productName: z.string().min(1, "Informe o nome do produto"),
  acquisitionCost: z.coerce.number().min(0.01, "Deve ser maior que zero"),
  shippingCost: z.coerce.number().min(0),
  packagingCost: z.coerce.number().min(0),
  purchaseTax: z.coerce.number().min(0).max(100),
  operationalCosts: z.coerce.number().min(0).max(100),
  cardFeeRate: z.coerce.number().min(0).max(100),
  desiredMargin: z.coerce.number().min(1).max(99),
});

export type EditFormData = z.infer<typeof editSchema>;

export function EditModal({
  calc,
  onClose,
  onSave,
}: {
  calc: SavedCalculation;
  onClose: () => void;
  onSave: (id: string, input: PricingInput, result: PricingResult) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      productName: calc.input.productName,
      acquisitionCost: calc.input.acquisitionCost,
      shippingCost: calc.input.shippingCost,
      packagingCost: calc.input.packagingCost,
      purchaseTax: calc.input.purchaseTax,
      operationalCosts: calc.input.operationalCosts,
      cardFeeRate: calc.input.cardFeeRate || 0,
      desiredMargin: calc.input.desiredMargin,
    },
  });

  const onSubmit = async (data: EditFormData) => {
    setSaving(true);
    const newResult = calculatePrice(data);
    await onSave(calc.id, data, newResult);
    setSaving(false);
    onClose();
  };

  const Field = ({
    label, name, prefix, suffix,
  }: {
    label: string; name: keyof EditFormData; prefix?: string; suffix?: string;
  }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{prefix}</span>
        )}
        <input
          {...register(name)}
          type="number"
          step="0.01"
          className={`w-full py-2.5 border rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${prefix ? "pl-9 pr-3" : suffix ? "pl-3 pr-9" : "px-3"} ${errors[name] ? "border-red-300" : "border-gray-200"}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{suffix}</span>
        )}
      </div>
      {errors[name] && (
        <p className="mt-1 text-xs text-red-500">{errors[name]?.message}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <Pencil className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Editar Cálculo</h2>
              <p className="text-xs text-gray-500">
                Os resultados serão recalculados automaticamente
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Nome do Produto
            </label>
            <input
              {...register("productName")}
              type="text"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.productName && (
              <p className="mt-1 text-xs text-red-500">{errors.productName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Custo de Aquisição (R$)" name="acquisitionCost" prefix="R$" />
            <Field label="Frete (R$)" name="shippingCost" prefix="R$" />
          </div>
          <Field label="Embalagem (R$)" name="packagingCost" prefix="R$" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Impostos na Compra (%)" name="purchaseTax" suffix="%" />
            <Field label="Custos Operacionais (%)" name="operationalCosts" suffix="%" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Margem Desejada (%)" name="desiredMargin" suffix="%" />
            <Field label="Taxa da Maquininha (%)" name="cardFeeRate" suffix="%" />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
            <Calculator className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Ao salvar, o preço de venda e todos os resultados serão recalculados com os novos valores.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
