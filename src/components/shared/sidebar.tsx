"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTheme } from "@/components/theme-provider";
import {
  LayoutDashboard,
  FlaskConical,
  Boxes,
  ShoppingCart,
  FileSignature,
  Users,
  LogOut,
  Sun,
  Moon,
  Shield,
  Menu,
  X
} from "lucide-react";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const getLinks = (role: string) => {
    switch (role) {
      case "ADMIN":
        return [
          { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
          { name: "Products", href: "/admin/products", icon: FlaskConical },
          { name: "Inventory", href: "/admin/inventory", icon: Boxes },
          { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
          { name: "Quotations", href: "/admin/quotations", icon: FileSignature },
          { name: "User Management", href: "/admin/users", icon: Users },
        ];
      case "SELLER":
        return [
          { name: "Browse Products", href: "/seller/products", icon: FlaskConical },
          { name: "Quotations", href: "/seller/quotations", icon: FileSignature },
          { name: "Orders", href: "/seller/orders", icon: ShoppingCart },
        ];
      case "USER":
      default:
        return [
          { name: "Browse Products", href: "/user/products", icon: FlaskConical },
          { name: "My Orders", href: "/user/orders", icon: ShoppingCart },
        ];
    }
  };

  const links = getLinks(user.role);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card/60 backdrop-blur-xl border-r border-border text-foreground w-64">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-border">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <FlaskConical className="h-5 w-5" />
        </div>
        <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
          ChemFlow
        </span>
      </div>

      {/* User Info Profile Box */}
      <div className="p-4 border-b border-border bg-slate-500/5 m-3 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold text-xs uppercase">
            {user.name ? user.name[0] : user.email ? user.email[0] : "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-foreground">{user.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md w-fit">
          <Shield className="h-3 w-3" />
          <span className="text-[10px] font-bold tracking-wider uppercase">{user.role}</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 py-4 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-105 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Tools & Sign Out */}
      <div className="p-4 border-t border-border space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between w-full px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            <span>Theme</span>
          </div>
          <span className="text-xs uppercase font-semibold opacity-70">{theme} Mode</span>
        </button>

        {/* Log Out */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 w-full text-left cursor-pointer transition-colors"
        >
          <LogOut className="h-4.5 w-4.5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header (Navbar Stub for Mobile menu trigger) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg text-foreground">ChemFlow</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 border rounded-md hover:bg-accent cursor-pointer"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative flex flex-col h-full w-64 z-50 animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
