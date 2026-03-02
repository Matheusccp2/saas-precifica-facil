export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isActive: boolean;
  plan: "free" | "pro" | "enterprise";
  createdAt: Date;
}

export interface PricingInput {
  productName: string;
  acquisitionCost: number;
  shippingCost: number;
  packagingCost: number;
  purchaseTax: number;
  operationalCosts: number;
  desiredMargin: number;
}

export interface PricingResult {
  suggestedPrice: number;
  productCost: number;
  productCostPercent: number;
  variableExpenses: number;
  variableExpensesPercent: number;
  grossProfit: number;
  grossProfitPercent: number;
  markup: number;
  saleTax: number;
  saleTaxPercent: number;
  realNetMargin: number;
}

export interface SavedCalculation {
  id: string;
  userId: string;
  input: PricingInput;
  result: PricingResult;
  createdAt: Date;
  updatedAt: Date;
}