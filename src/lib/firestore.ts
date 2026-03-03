import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  writeBatch,
  getCountFromServer,
  getAggregateFromServer,
  average,
  sum,
} from "firebase/firestore";
import { db } from "./firebase";
import { PricingInput, PricingResult, SavedCalculation } from "@/types";


export async function saveCalculation(
  userId: string,
  input: PricingInput,
  result: PricingResult
): Promise<string> {
  const ref = await addDoc(collection(db, "calculations"), {
    userId,
    productName: input.productName,
    input,
    result,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUserCalculations(
  userId: string,
  limitCount = 50
): Promise<SavedCalculation[]> {
  const q = query(
    collection(db, "calculations"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: (d.data().createdAt as Timestamp)?.toDate() ?? new Date(),
    updatedAt: (d.data().updatedAt as Timestamp)?.toDate() ?? new Date(),
  })) as SavedCalculation[];
}

export async function deleteCalculation(calcId: string): Promise<void> {
  await deleteDoc(doc(db, "calculations", calcId));
}


export async function getReportData(userId: string) {
  const q = query(
    collection(db, "calculations"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: (d.data().createdAt as Timestamp)?.toDate() ?? new Date(),
  })) as SavedCalculation[];

  if (docs.length === 0) {
    return {
      totalCalculations: 0,
      averageMargin: 0,
      averageMarkup: 0,
      topProduct: null,
      lowestMarginProduct: null,
      marginDistribution: [],
      evolutionData: [],
      topProducts: [],
    };
  }

  const avgMargin =
    docs.reduce((acc, d) => acc + d.result.realNetMargin, 0) / docs.length;

  const avgMarkup =
    docs.reduce((acc, d) => acc + d.result.markup, 0) / docs.length;

  const topProduct = docs.reduce((prev, curr) =>
    curr.result.realNetMargin > prev.result.realNetMargin ? curr : prev
  );

  const lowestMarginProduct = docs.reduce((prev, curr) =>
    curr.result.realNetMargin < prev.result.realNetMargin ? curr : prev
  );

  const marginDistribution = [
    { range: "0–15%", count: docs.filter((d) => d.result.realNetMargin < 15).length },
    { range: "15–25%", count: docs.filter((d) => d.result.realNetMargin >= 15 && d.result.realNetMargin < 25).length },
    { range: "25–35%", count: docs.filter((d) => d.result.realNetMargin >= 25 && d.result.realNetMargin < 35).length },
    { range: "35%+", count: docs.filter((d) => d.result.realNetMargin >= 35).length },
  ];

  const now = new Date();
  const evolutionData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthDocs = docs.filter((d) => {
      const docDate = d.createdAt;
      return (
        docDate.getMonth() === date.getMonth() &&
        docDate.getFullYear() === date.getFullYear()
      );
    });
    return {
      month: date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
      calculos: monthDocs.length,
      margemMedia:
        monthDocs.length > 0
          ? parseFloat(
              (
                monthDocs.reduce((a, d) => a + d.result.realNetMargin, 0) /
                monthDocs.length
              ).toFixed(1)
            )
          : 0,
    };
  });

  const topProducts = [...docs]
    .sort((a, b) => b.result.realNetMargin - a.result.realNetMargin)
    .slice(0, 5);

  return {
    totalCalculations: docs.length,
    averageMargin: parseFloat(avgMargin.toFixed(1)),
    averageMarkup: parseFloat(avgMarkup.toFixed(2)),
    topProduct,
    lowestMarginProduct,
    marginDistribution,
    evolutionData,
    topProducts,
  };
}


export async function exportUserData(userId: string) {
  const userDoc = await getDoc(doc(db, "users", userId));
  const calcsSnapshot = await getDocs(
    query(collection(db, "calculations"), where("userId", "==", userId))
  );

  const calculations = calcsSnapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: (d.data().createdAt as Timestamp)?.toDate()?.toISOString(),
  }));

  return {
    exportedAt: new Date().toISOString(),
    user: { id: userId, ...userDoc.data() },
    calculations,
  };
}

export async function deleteAllUserData(userId: string): Promise<void> {
  const calcsSnapshot = await getDocs(
    query(collection(db, "calculations"), where("userId", "==", userId))
  );

  const batch = writeBatch(db);

  calcsSnapshot.docs.forEach((d) => batch.delete(d.ref));

  batch.delete(doc(db, "users", userId));

  await batch.commit();
}

export async function updateCalculation(
  calcId: string,
  input: PricingInput,
  result: PricingResult
): Promise<void> {
  await updateDoc(doc(db, "calculations", calcId), {
    productName: input.productName,
    input,
    result,
    updatedAt: serverTimestamp(),
  });
}