import { NextRequest, NextResponse } from "next/server";
import { payment } from "@/lib/mercadopago";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("payment_id");

    if (!paymentId) {
      return NextResponse.json({ error: "payment_id obrigatório." }, { status: 400 });
    }

    const data = await payment.get({ id: paymentId });

    return NextResponse.json({
      status: data.status,
      approved: data.status === "approved",
    });
  } catch (error) {
    console.error("Erro ao verificar pagamento:", error);
    return NextResponse.json({ error: "Erro ao verificar." }, { status: 500 });
  }
}