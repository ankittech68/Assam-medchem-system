"use client";

import React from "react";
import { Bell, Search, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-16 border-b border-border bg-background/50 backdrop-blur-md w-full">
      {/* Search Bar */}
      <div className="relative w-full max-w-sm hidden sm:block">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Global search..." className="pl-9 h-9 w-full bg-muted/40 border-border/50 focus:bg-background" />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Compliance indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-xs font-semibold select-none">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>ISO 9001 Compliant</span>
        </div>

        {/* Notifications */}
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg cursor-pointer transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-ping" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  );
}
