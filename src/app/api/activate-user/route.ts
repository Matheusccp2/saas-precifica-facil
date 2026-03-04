import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminDb() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
  return getFirestore();
}

export async function POST(req: NextRequest) {
  try {
    const { uid, email } = await req.json();

    if (!uid || !email) {
      return NextResponse.json(
        { error: "uid e email são obrigatórios." },
        { status: 400 }
      );
    }

    const db = getAdminDb();

    // Busca pagamento aprovado para este e-mail
    const paymentsSnapshot = await db
      .collection("payments")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (paymentsSnapshot.empty) {
      return NextResponse.json(
        { activated: false, reason: "Nenhum pagamento encontrado." },
        { status: 200 }
      );
    }

    const paymentDoc = paymentsSnapshot.docs[0];
    const paymentData = paymentDoc.data();

    // Ativa o usuário via Admin SDK (bypassa as Firestore rules)
    await db.collection("users").doc(uid).update({
      isActive: true,
      plan: paymentData.plan ?? "anual",
      activatedAt: new Date().toISOString(),
      planExpiresAt: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Atualiza o pagamento com o uid
    await paymentDoc.ref.update({
      uid,
      activatedAt: new Date().toISOString(),
    });

    console.log(`✅ Usuário ${email} ativado via API.`);

    return NextResponse.json({ activated: true });
  } catch (error: any) {
    console.error("Erro ao ativar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno ao ativar usuário." },
      { status: 500 }
    );
  }
}