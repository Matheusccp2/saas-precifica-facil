"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";
import {
  saveCalculation,
  getUserCalculations,
  deleteCalculation,
} from "@/lib/firestore";
import { PricingInput, PricingResult, SavedCalculation } from "@/types";
import { toast } from "sonner";

export function useCalculations() {
  const { user, loading: authLoading } = useAuth();
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false);

  const fetchCalculations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    hasFetched.current = true;
    try {
      const data = await getUserCalculations(user.uid);
      setCalculations(data);
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
      toast.error("Erro ao carregar histórico.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Aguarda o auth terminar de carregar antes de buscar
  useEffect(() => {
    if (!authLoading && user) {
      fetchCalculations();
    }
    if (!authLoading && !user) {
      setCalculations([]);
    }
  }, [authLoading, user, fetchCalculations]);

  const save = async (input: PricingInput, result: PricingResult) => {
    if (!user) return;
    try {
      await saveCalculation(user.uid, input, result);
      toast.success("Cálculo salvo no histórico!");
      await fetchCalculations();
    } catch (err) {
      console.error("Erro ao salvar:", err);
      toast.error("Erro ao salvar cálculo.");
    }
  };

  const remove = async (calcId: string) => {
    try {
      await deleteCalculation(calcId);
      setCalculations((prev) => prev.filter((c) => c.id !== calcId));
      toast.success("Cálculo removido.");
    } catch (err) {
      console.error("Erro ao remover:", err);
      toast.error("Erro ao remover cálculo.");
    }
  };

  return {
    calculations,
    loading: loading || authLoading,
    save,
    remove,
    refetch: fetchCalculations,
  };
}