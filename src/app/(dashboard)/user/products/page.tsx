"use client";

import React from "react";
import ProductCatalog from "@/components/shared/product-catalog";

export default function UserProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Chemical Store</h1>
        <p className="text-muted-foreground text-sm">
          Browse available chemical inventories and request items for your contract accounts.
        </p>
      </div>

      <ProductCatalog role="USER" />
    </div>
  );
}
