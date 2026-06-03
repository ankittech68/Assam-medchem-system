"use client";

import React from "react";
import ProductCatalog from "@/components/shared/product-catalog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function AdminProductsPage() {
  const { toast } = useToast();

  const handleAddNewProduct = () => {
    toast({
      title: "Action Disabled",
      description: "Database mutations require live backend endpoints.",
      type: "warning",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Chemical Catalog</h1>
          <p className="text-muted-foreground text-sm">
            Add, update, and search active chemicals catalog baseline specifications.
          </p>
        </div>
        <Button onClick={handleAddNewProduct} className="font-semibold shrink-0 cursor-pointer">
          <Plus className="mr-2 h-4 w-4" /> Add Chemical Product
        </Button>
      </div>

      <ProductCatalog role="ADMIN" />
    </div>
  );
}
