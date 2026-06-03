"use client";

import React from "react";
import OrderManagement from "@/components/shared/order-management";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Order Management</h1>
        <p className="text-muted-foreground text-sm">
          Review buyer purchase orders, approve transactions, and trace fulfillment logs.
        </p>
      </div>

      <OrderManagement />
    </div>
  );
}
