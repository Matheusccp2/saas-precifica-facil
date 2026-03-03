"use client";

import { useState } from "react";
import { User } from "firebase/auth";
import { Shield, Download, CheckCircle, Loader2 } from "lucide-react";
import { exportUserData } from "@/lib/firestore";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface LgpdSectionProps {
  user: User | null;
}

export function LgpdSection({ user }: LgpdSectionProps) {
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!user) return;
    setExporting(true);
    try {
      const data = await exportUserData(user.uid);

      // Instanciando o jsPDF
      const doc = new jsPDF();
      
      // Cabeçalho
      doc.setFontSize(20);
      doc.text("Dados do Usuário - PrecificaFácil", 14, 22);

      // Informações Gerais
      const userData = data.user as any;
      doc.setFontSize(12);
      doc.text(`Nome: ${userData?.displayName || "N/A"}`, 14, 32);
      doc.text(`E-mail: ${userData?.email || "N/A"}`, 14, 38);
      doc.text(`ID da Conta: ${userData?.uid || userData.id || user.uid}`, 14, 44);
      doc.text(`Exportado em: ${new Date(data.exportedAt).toLocaleString("pt-BR")}`, 14, 50);

      const calcs = data.calculations || [];

      if (calcs.length > 0) {
        doc.text("Histórico de Cálculos:", 14, 60);

        // Preparando os dados para a tabela
        const tableColumn = ["Data", "Produto", "Custo Total", "Preço Sugerido", "Lucro", "Margem"];
        const tableRows: any[] = [];

        calcs.forEach((calc: any) => {
          const date = new Date(calc.createdAt).toLocaleDateString("pt-BR");
          const product = calc.productName;
          const cost = calc.result?.totalCost?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) || "R$ 0,00";
          const price = calc.result?.suggestedPrice?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) || "R$ 0,00";
          const profit = calc.result?.netProfit?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) || "R$ 0,00";
          const margin = calc.result?.realNetMargin ? `${calc.result.realNetMargin.toFixed(2)}%` : "0%";

          const rowData = [date, product, cost, price, profit, margin];
          tableRows.push(rowData);
        });

        // Gerando a tabela
        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 65,
          theme: "grid",
          styles: { fontSize: 10 },
          headStyles: { fillColor: [37, 99, 235] }, // Azul
        });
      } else {
        doc.text("Nenhum cálculo salvo encontrado.", 14, 60);
      }

      // Salvando o arquivo
      doc.save(`meus-dados-precificafacil-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("Seus dados foram exportados em PDF com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao exportar dados.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <Shield className="w-4 h-4 text-green-600" />
        </div>
        <h2 className="font-bold text-gray-900">Privacidade e LGPD</h2>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        Em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018), você tem os seguintes direitos:
      </p>
      <div className="space-y-2 mb-6">
        {[
          "Acesso aos seus dados pessoais armazenados",
          "Portabilidade: exportar seus dados em PDF",
          "Direito ao esquecimento: excluir sua conta e dados",
          "Dados coletados: nome, e-mail e cálculos realizados",
        ].map((text) => (
          <div key={text} className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">{text}</span>
          </div>
        ))}
      </div>
      <button
        onClick={handleExportPDF}
        disabled={exporting}
        className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-60"
      >
        {exporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {exporting ? "Gerando PDF..." : "Exportar meus dados (PDF)"}
      </button>
    </div>
  );
}
