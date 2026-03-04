import { NextRequest, NextResponse } from "next/server";
import { preference } from "@/lib/mercadopago";

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email e nome são obrigatórios." },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    const result = await preference.create({
      body: {
        items: [
          {
            id: "precifica-facil-anual",
            title: "PrecificaFácil — Plano Anual",
            description: "Acesso completo à calculadora de precificação por 1 ano",
            quantity: 1,
            unit_price: 0.01,
            currency_id: "BRL",
          },
        ],
        payer: {
          email,
          name,
        },
        payment_methods: {
          installments: 1,
        },
        back_urls: {
          success: `${appUrl}/pagamento/sucesso`,
          failure: `${appUrl}/pagamento/falha`,
          pending: `${appUrl}/pagamento/pendente`,
        },
        // ← Removido auto_return pois bloqueia o redirect do PIX
        notification_url: `${appUrl}/api/webhooks/mercadopago`,
        metadata: {
          customer_email: email,
          customer_name: name,
        },
        statement_descriptor: "PRECIFICAFACIL",
      },
    });

    return NextResponse.json({
      id: result.id,
      init_point: result.init_point,
    });
  } catch (error) {
    console.error("Erro ao criar preferência MP:", error);
    return NextResponse.json(
      { error: "Erro ao criar preferência de pagamento." },
      { status: 500 }
    );
  }
}