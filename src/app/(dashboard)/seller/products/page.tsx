"use client";

import React from "react";
import ProductCatalog from "@/components/shared/product-catalog";
import QuotationCalculator from "@/components/shared/quotation-calculator";

export default function SellerProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Sales Desk Catalog</h1>
        <p className="text-muted-foreground text-sm">
          Browse current stock availability and prepare custom pricing proposals for buyer accounts.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left Side: Product Browser */}
        <div className="xl:col-span-2 space-y-4">
          <ProductCatalog role="SELLER" />
        </div>

        {/* Right Side: Pricing calculator */}
        <div className="h-fit">
          <QuotationCalculator />
        </div>
      </div>
    </div>
  );
}
