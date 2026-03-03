"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/layout/Sidebar";
import { Loader2, Menu, Calculator } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isActive } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!isActive) {
        router.push("/aguardando-ativacao");
      }
    }
  }, [user, loading, isActive, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user || !isActive) return null;

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50">
      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 shadow-sm z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">
            <span className="text-gray-900">Precifica</span>
            <span className="text-blue-600">Fácil</span>
          </span>
        </div>
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="p-2 -mr-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto no-scrollbar">{children}</main>
      </div>
    </div>
  );
}