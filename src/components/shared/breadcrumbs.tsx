"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const labelMap: Record<string, string> = {
  admin: "Admin",
  seller: "Seller",
  user: "Client Sourcing",
  dashboard: "Dashboard",
  products: "Chemical Catalog",
  inventory: "Warehouse Inventory",
  orders: "Purchase Orders",
  quotations: "Pricing Quotes",
  users: "User Accounts",
  unauthorized: "Access Blocked",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/login" || pathname === "/register" || pathname === "/unauthorized") {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground select-none mb-4 animate-in fade-in slide-in-from-top-1 duration-200">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-foreground transition-colors duration-200"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {segments.map((segment, index) => {
        const url = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const rawLabel = labelMap[segment] || segment.replace(/-/g, " ");
        // Capitalize segment label if not mapped
        const label = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);

        return (
          <React.Fragment key={url}>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60 shrink-0" />
            {isLast ? (
              <span className="text-foreground font-bold truncate max-w-[150px] sm:max-w-xs">{label}</span>
            ) : (
              <Link
                href={url}
                className="hover:text-foreground transition-colors duration-200 truncate max-w-[120px] sm:max-w-xs"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
