import { NextRequest, NextResponse } from "next/server";
import { payment } from "@/lib/mercadopago";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// ── Firebase Admin (server-side) ──
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

async function activateUser(email: string, name: string) {
  const db = getAdminDb();
  const adminAuth = getAuth();

  let uid: string | null = null;

  // Busca o usuário pelo e-mail no Firebase Auth
  try {
    const userRecord = await adminAuth.getUserByEmail(email);
    uid = userRecord.uid;
  } catch {
    // Usuário ainda não tem conta — será ativado quando criar
    console.log(`Usuário ${email} ainda não tem conta. Guardando pré-ativação.`);
  }

  // Salva registro de pagamento aprovado
  const paymentRecord = {
    email,
    name,
    paidAt: new Date().toISOString(),
    plan: "anual",
    amount: 9.90,
    activatedAt: uid ? new Date().toISOString() : null,
    uid: uid ?? null,
  };

  await db.collection("payments").add(paymentRecord);

  // Se usuário já tem conta → ativa imediatamente
  if (uid) {
    await db.collection("users").doc(uid).update({
      isActive: true,
      plan: "anual",
      activatedAt: new Date().toISOString(),
      planExpiresAt: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString(), // +1 ano
      updatedAt: new Date().toISOString(),
    });

    console.log(`✅ Usuário ${email} ativado com sucesso.`);
  }

  return uid;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // MP envia diferentes tipos de notificação
    const topic = body.type || body.topic;
    const resourceId = body.data?.id || body.id;

    console.log("Webhook MP recebido:", { topic, resourceId });

    // Processa apenas pagamentos aprovados
    if (topic !== "payment") {
      return NextResponse.json({ received: true });
    }

    if (!resourceId) {
      return NextResponse.json({ received: true });
    }

    // Busca detalhes do pagamento na API do MP
    const paymentData = await payment.get({ id: resourceId });

    console.log("Status do pagamento:", paymentData.status);

    // Só ativa se pagamento aprovado
    if (paymentData.status !== "approved") {
      return NextResponse.json({ received: true });
    }

    const email =
      paymentData.metadata?.customer_email ||
      paymentData.payer?.email;

    const name =
      paymentData.metadata?.customer_name ||
      paymentData.payer?.first_name ||
      "Cliente";

    if (!email) {
      console.error("Email não encontrado no pagamento:", paymentData.id);
      return NextResponse.json({ received: true });
    }

    await activateUser(email, name);

    return NextResponse.json({ received: true, activated: true });
  } catch (error) {
    console.error("Erro no webhook MP:", error);
    // Retorna 200 mesmo com erro para o MP não retentar infinitamente
    return NextResponse.json({ received: true });
  }
}