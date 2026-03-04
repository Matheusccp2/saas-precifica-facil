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
    marketplaceCosts,
  } = input;

  // 1. Imposto pago na compra do produto (ex: ICMS, IPI)
  //    Ex: produto R$100 com 5% de imposto = R$5,00
  const taxAmount = (acquisitionCost * purchaseTax) / 100;

  // 2. Custo total do produto (tudo que você paga ANTES de vender)
  //    Aquisição + Frete + Embalagem + Imposto de compra + Taxa do marketplace (R$ fixo)
  //    Ex: R$100 + R$10 + R$2 + R$5 + R$8 = R$125,00
  const productCost =
    acquisitionCost +
    shippingCost +
    packagingCost +
    taxAmount +
    (marketplaceCosts || 0);

  // 3. Soma dos custos variáveis em % (incidem sobre o preço de venda)
  //    Custos operacionais (comissões, plataforma) + Taxa da maquininha
  //    Ex: 15% operacional + 2,99% maquininha = 17,99%
  const totalVariableCosts = operationalCosts + (cardFeeRate || 0);

  // 4. Markup — fator multiplicador que cobre todos os custos % e ainda gera a margem desejada
  //    Fórmula: 1 / (1 - (margem + custos variáveis) / 100)
  //    Ex: 1 / (1 - (40 + 17,99) / 100) = 1 / (1 - 0,5799) = 1 / 0,4201 = 2,38x
  const markup = 1 / (1 - (desiredMargin + totalVariableCosts) / 100);

  // 5. Preço de venda sugerido = custo do produto × markup
  //    Ex: R$125,00 × 2,38 = R$297,50
  const suggestedPrice = productCost * markup;

  // 6. Despesas variáveis em R$ (valor que será pago em % sobre o preço de venda)
  //    Ex: R$297,50 × 17,99% = R$53,53
  const variableExpenses = (suggestedPrice * totalVariableCosts) / 100;

  // 7. Imposto sobre a venda pelo Simples Nacional (alíquota fixa de 11%)
  //    Ex: R$297,50 × 11% = R$32,73
  const saleTaxPercent = 11;
  const saleTax = (suggestedPrice * saleTaxPercent) / 100;

  // 8. Lucro bruto = preço de venda - custo do produto - despesas variáveis
  //    É o que sobra antes de descontar o imposto sobre a venda
  //    Ex: R$297,50 - R$125,00 - R$53,53 = R$118,97
  const grossProfit = suggestedPrice - productCost - variableExpenses;

  // 9. Margem líquida real em % = ((lucro bruto - imposto de venda) / preço de venda) × 100
  //    É o lucro real depois de todos os descontos, em relação ao preço de venda
  //    Ex: ((R$118,97 - R$32,73) / R$297,50) × 100 = 28,98%
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
