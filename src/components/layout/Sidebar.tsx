"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calculator,
  LayoutDashboard,
  History,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  MessageCircle,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/calculadora", icon: Calculator, label: "Calculadora" },
  { href: "/historico", icon: History, label: "Histórico" },
  { href: "/curva-abc", icon: TrendingUp, label: "Curva ABC" },
  { href: "/relatorios", icon: BarChart3, label: "Relatórios" },
  { href: "/configuracoes", icon: Settings, label: "Configurações" },
];

const WHATSAPP_NUMBER = "5511999999999"; // ← substitua pelo seu número
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Olá! Preciso de suporte técnico no PrecificaFácil.",
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Você saiu da plataforma.");
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col h-[100dvh] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:h-screen lg:sticky lg:top-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={() => onClose()}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">
              <span className="text-gray-900">Precifica</span>
              <span className="text-blue-600">Fácil</span>
            </span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose()}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActive
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600",
                )}
              />
              {item.label}
              {isActive && (
                <ChevronRight className="w-4 h-4 ml-auto text-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Suporte WhatsApp */}
      <div className="px-4 pb-2">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-all border"
        >
          <MessageCircle className="w-5 h-5 text-green-600" />
          Suporte via WhatsApp
        </a>
      </div>

      {/* User */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-700 text-sm font-bold">
              {user?.displayName?.charAt(0).toUpperCase() ?? "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.displayName ?? "Usuário"}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
    </>
  );
}
