import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PrecificaFácil — Calculadora de Precificação Inteligente",
  description:
    "Calcule rapidamente o preço de venda ideal com base em custos, impostos e margem desejada.",
  keywords: "calculadora precificação, preço de venda, markup, lucro, lojista",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}