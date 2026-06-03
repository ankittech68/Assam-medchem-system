"use client";

import React from "react";
import InventoryTracker from "@/components/shared/inventory-tracker";

export default function AdminInventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Batch Inventory</h1>
        <p className="text-muted-foreground text-sm">
          Trace physical chemical warehouse batches, shelf location coordinates, and expiration health levels.
        </p>
      </div>

      <InventoryTracker />
    </div>
  );
}
