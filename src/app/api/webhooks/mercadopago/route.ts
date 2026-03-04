import { NextRequest, NextResponse } from "next/server";
import { payment } from "@/lib/mercadopago";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function getAdminApp() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
  return { db: getFirestore(), adminAuth: getAuth() };
}

// Gera senha aleatória segura
function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!";
  return Array.from({ length: 12 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

async function processApprovedPayment(email: string, name: string) {
  const { db, adminAuth } = getAdminApp();
  const firstName = name.split(" ")[0];

  // ── Verifica se este pagamento já foi processado ──
  const existingPayment = await db
    .collection("payments")
    .where("email", "==", email)
    .limit(1)
    .get();

  if (!existingPayment.empty) {
    console.log(`⏭️ Pagamento já processado para ${email}, pulando.`);
    return;
  }

  let uid: string;
  let tempPassword: string | null = null;
  let isNewUser = false;

  try {
    // Usuário já existe no Firebase Auth → apenas ativa
    const existing = await adminAuth.getUserByEmail(email);
    uid = existing.uid;

    await db.collection("users").doc(uid).update({
      isActive: true,
      plan: "anual",
      activatedAt: new Date().toISOString(),
      planExpiresAt: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log(`♻️ Usuário existente ativado: ${email}`);

  } catch {
    // Usuário não existe → cria com senha temporária
    isNewUser = true;
    tempPassword = generateTempPassword();

    const userRecord = await adminAuth.createUser({
      email,
      displayName: name,
      password: tempPassword,
      emailVerified: false,
    });

    uid = userRecord.uid;

    await db.collection("users").doc(uid).set({
      uid,
      email,
      displayName: name,
      isActive: true,
      plan: "anual",
      mustChangePassword: true,
      activatedAt: new Date().toISOString(),
      planExpiresAt: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log(`🆕 Novo usuário criado: ${email}`);
  }

  // Salva registro do pagamento
  await db.collection("payments").add({
    uid,
    email,
    name,
    plan: "anual",
    amount: 9.90,
    paidAt: new Date().toISOString(),
    activatedAt: new Date().toISOString(),
    isNewUser,
  });

  // Envia e-mail com dados de acesso
  await sendWelcomeEmail({ email, name: firstName, tempPassword, isNewUser });

  console.log(`✅ Pagamento processado para ${email} — novo usuário: ${isNewUser}`);
  return uid;
}

async function sendWelcomeEmail({
  email,
  name,
  tempPassword,
  isNewUser,
}: {
  email: string;
  name: string;
  tempPassword: string | null;
  isNewUser: boolean;
}) {
  try {
    console.log("📧 Enviando e-mail para:", email);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    const html = isNewUser ? `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">

        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #2563eb; font-size: 28px; margin: 0;">
            Precifica<span style="color: #1d4ed8;">Fácil</span>
          </h1>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h2 style="color: #16a34a; margin: 0 0 8px 0;">✅ Pagamento confirmado!</h2>
          <p style="margin: 0; color: #15803d;">Seu acesso foi liberado com sucesso.</p>
        </div>

        <p>Olá, <strong>${name}</strong>!</p>
        <p>Seu pagamento foi aprovado e sua conta já está ativa. Criamos seu acesso automaticamente:</p>

        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #1d4ed8; margin: 0 0 16px 0;">🔑 Seus dados de acesso</h3>
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; width: 120px;">E-mail:</td>
              <td style="padding: 8px 0; font-weight: bold;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Senha:</td>
              <td style="padding: 8px 0;">
                <code style="background: #1e3a5f; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 18px; letter-spacing: 3px;">
                  ${tempPassword}
                </code>
              </td>
            </tr>
          </table>
        </div>

        <div style="background: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            ⚠️ <strong>Por segurança, altere sua senha</strong> após o primeiro acesso
            em Configurações → Alterar senha.
          </p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${appUrl}/login"
            style="background: #2563eb; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
            Acessar o PrecificaFácil →
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />

        <div style="background: #f8fafc; border-radius: 12px; padding: 16px;">
          <h4 style="margin: 0 0 12px 0; color: #475569;">📦 Seu plano inclui:</h4>
          <ul style="margin: 0; padding-left: 20px; color: #64748b; font-size: 14px; line-height: 2;">
            <li>Calculadora de precificação completa</li>
            <li>Taxa da maquininha no cálculo</li>
            <li>Histórico ilimitado de cálculos</li>
            <li>Curva ABC dos produtos</li>
            <li>Relatórios e gráficos</li>
            <li>Suporte via WhatsApp</li>
          </ul>
        </div>

        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 32px;">
          Dúvidas? Fale conosco pelo WhatsApp.<br/>
          © ${new Date().getFullYear()} PrecificaFácil. Todos os direitos reservados.
        </p>

      </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">

        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #2563eb; font-size: 28px; margin: 0;">
            Precifica<span style="color: #1d4ed8;">Fácil</span>
          </h1>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h2 style="color: #16a34a; margin: 0 0 8px 0;">✅ Plano renovado!</h2>
          <p style="margin: 0; color: #15803d;">Seu acesso foi renovado por mais 1 ano.</p>
        </div>

        <p>Olá, <strong>${name}</strong>! Seu pagamento foi confirmado.</p>
        <p>Seu acesso está ativo por mais um ano. É só fazer login normalmente.</p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${appUrl}/login"
            style="background: #2563eb; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
            Acessar o PrecificaFácil →
          </a>
        </div>

        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 32px;">
          © ${new Date().getFullYear()} PrecificaFácil. Todos os direitos reservados.
        </p>

      </body>
      </html>
    `;

    const result = await transporter.sendMail({
      from: `"PrecificaFácil" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: isNewUser
        ? "✅ Seu acesso ao PrecificaFácil está liberado!"
        : "✅ Plano PrecificaFácil renovado com sucesso!",
      html,
    });

    console.log("📧 E-mail enviado com sucesso! ID:", result.messageId);

  } catch (error: any) {
    console.error("❌ Erro ao enviar e-mail:", error.message);
  }
}

export async function POST(req: NextRequest) {
  console.log("🔔 WEBHOOK RECEBIDO!");

  try {
    const body = await req.json();
    console.log("📦 Body completo:", JSON.stringify(body, null, 2));

    const topic = body.type || body.topic;

    // ← Suporta todos os formatos que o MP envia
    const resourceId =
      body.data?.id ||           // formato novo: { data: { id: "123" } }
      body.id ||                  // formato alternativo
      body.resource?.toString().split("/").pop(); // formato legado: "148033119265" ou URL

    console.log("📌 Topic:", topic);
    console.log("📌 Resource ID:", resourceId);

    if (topic !== "payment" || !resourceId) {
      console.log("⏭️ Ignorando — não é pagamento ou sem ID");
      return NextResponse.json({ received: true });
    }

    console.log("💳 Buscando pagamento no MP...");
    const paymentData = await payment.get({ id: resourceId });
    console.log("💳 Status:", paymentData.status);
    console.log("💳 Metadata:", paymentData.metadata);

    if (paymentData.status !== "approved") {
      console.log("⏭️ Não aprovado ainda:", paymentData.status);
      return NextResponse.json({ received: true });
    }

    const email =
      paymentData.metadata?.customer_email ||
      paymentData.payer?.email;

    const name =
      paymentData.metadata?.customer_name ||
      `${paymentData.payer?.first_name ?? ""} ${paymentData.payer?.last_name ?? ""}`.trim() ||
      "Cliente";

    console.log("👤 Processando:", { email, name });

    if (!email) {
      console.error("❌ E-mail não encontrado");
      return NextResponse.json({ received: true });
    }

    await processApprovedPayment(email, name);

    return NextResponse.json({ received: true, activated: true });

  } catch (error: any) {
    console.error("❌ ERRO NO WEBHOOK:", error.code, error.message);
    return NextResponse.json({ received: true });
  }
}