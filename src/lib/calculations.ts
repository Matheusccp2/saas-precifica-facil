import { PricingInput, PricingResult } from "@/types";

export function calculatePrice(input: PricingInput): PricingResult {
  const {
    acquisitionCost,
    shippingCost,
    packagingCost,
    purchaseTax,
    operationalCosts,
    cardFeeRate,
    desiredMargin,
  } = input;

  const taxAmount = (acquisitionCost * purchaseTax) / 100;
  const productCost =
    acquisitionCost + shippingCost + packagingCost + taxAmount;

  // Inclui taxa da maquininha nos custos variáveis totais
  const totalVariableCosts = operationalCosts + (cardFeeRate || 0);

  const markup = 1 / (1 - (desiredMargin + totalVariableCosts) / 100);
  const suggestedPrice = productCost * markup;

  const variableExpenses = (suggestedPrice * totalVariableCosts) / 100;
  // const cardFeeAmount = (suggestedPrice * (cardFeeRate || 0)) / 100; // Caso precise

  const saleTaxPercent = 11;
  const saleTax = (suggestedPrice * saleTaxPercent) / 100;
  const grossProfit = suggestedPrice - productCost - variableExpenses;
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
