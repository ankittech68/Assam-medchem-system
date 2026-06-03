"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { 
  Boxes, Plus, Minus, X, ShieldAlert 
} from "lucide-react";

interface BatchInfo {
  id: string;
  batchNumber: string;
  location: string;
  expiry: string;
  quantity: number;
}

interface InventoryRecord {
  id: string;
  productName: string;
  formula: string;
  casNumber: string;
  baseUnit: "G" | "ML" | "ITEM";
  price: number;
  totalQuantity: number;
  batches: BatchInfo[];
}

const INITIAL_INVENTORY: InventoryRecord[] = [
  {
    id: "prod-1",
    productName: "Hydrochloric Acid (37%)",
    formula: "HCl",
    casNumber: "7647-01-0",
    baseUnit: "ML",
    price: 0.0185, // pricing per mL internally
    totalQuantity: 1200000, // 1,200 L internally stored as mL
    batches: [
      { id: "b1", batchNumber: "BT-HCL-8891", location: "Zone A - Shelf 3 - Row B", expiry: "2027-11-15", quantity: 1200000 }
    ]
  },
  {
    id: "prod-2",
    productName: "Ethanol (99.8%)",
    formula: "C2H5OH",
    casNumber: "64-17-5",
    baseUnit: "ML",
    price: 0.0128,
    totalQuantity: 850000,
    batches: [
      { id: "b2", batchNumber: "BT-ETH-5521", location: "Zone C - Cold Room 1", expiry: "2028-03-24", quantity: 850000 }
    ]
  },
  {
    id: "prod-3",
    productName: "Sodium Hydroxide Pellets",
    formula: "NaOH",
    casNumber: "1310-73-2",
    baseUnit: "G",
    price: 0.0082,
    totalQuantity: 45000, // 45 kg internally as grams
    batches: [
      { id: "b3", batchNumber: "BT-NaOH-211", location: "Zone B - Bin 42", expiry: "2026-08-01", quantity: 45000 }
    ]
  },
  {
    id: "prod-4",
    productName: "Acetone",
    formula: "CH3COCH3",
    casNumber: "67-64-1",
    baseUnit: "ML",
    price: 0.0220,
    totalQuantity: 12000, // 12 L internally as mL
    batches: [
      { id: "b4", batchNumber: "BT-ACT-9922", location: "Zone C - Flammable Rack 2", expiry: "2026-05-10", quantity: 12000 }
    ]
  },
  {
    id: "prod-5",
    productName: "Cobalt Chloride Reagent",
    formula: "CoCl2",
    casNumber: "7646-79-9",
    baseUnit: "ITEM",
    price: 45.00,
    totalQuantity: 8, // Critical stock level
    batches: [
      { id: "b5", batchNumber: "BT-COB-0112", location: "Zone B - Cabinet 3", expiry: "2027-01-01", quantity: 8 }
    ]
  }
];

export default function InventoryTracker() {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<InventoryRecord[]>(INITIAL_INVENTORY);
  const [selectedRecordId, setSelectedRecordId] = useState<string>(INITIAL_INVENTORY[0].id);
  const [adjustModal, setAdjustModal] = useState<{
    isOpen: boolean;
    productId: string;
    action: "ADD" | "SUBTRACT";
  } | null>(null);

  const [adjustQty, setAdjustQty] = useState("10");

  const selectedRecord = inventory.find((r) => r.id === selectedRecordId) || inventory[0];

  // Helper stock levels (in dimensions units)
  // Converting display value for threshold checks:
  // e.g. for grams we check kilograms value, or check count directly.
  // Standard healthy threshold is:
  // - Weight (G): >= 100,000 G (100 kg) -> Healthy, < 100k and >= 20k -> Low, < 20k -> Critical
  // - Volume (ML): >= 100,000 ML (100 L) -> Healthy, < 100k and >= 20k -> Low, < 20k -> Critical
  // - Count (ITEM): >= 100 -> Healthy, < 100 and >= 20 -> Low, < 20 -> Critical
  const getStockStatus = (record: InventoryRecord): { label: "HEALTHY" | "LOW" | "CRITICAL"; color: string; bg: string } => {
    const qty = record.totalQuantity;
    const unit = record.baseUnit;

    let thresholdLow = 20;
    let thresholdHealthy = 100;

    if (unit === "G" || unit === "ML") {
      thresholdLow = 20000;      // 20 kg / 20 L
      thresholdHealthy = 100000;  // 100 kg / 100 L
    }

    if (qty >= thresholdHealthy) {
      return { label: "HEALTHY", color: "text-emerald-500 border-emerald-500/20", bg: "bg-emerald-500/10" };
    } else if (qty >= thresholdLow) {
      return { label: "LOW", color: "text-amber-500 border-amber-500/20", bg: "bg-amber-500/10" };
    } else {
      return { label: "CRITICAL", color: "text-red-500 border-red-500/20", bg: "bg-red-500/10" };
    }
  };

  // Extract critical low alert list
  const criticalItems = inventory.filter((item) => getStockStatus(item).label === "CRITICAL");

  // Display quantities conversion (e.g. mL to Liters for cleaner read)
  const formatDisplayQty = (record: InventoryRecord) => {
    const qty = record.totalQuantity;
    const unit = record.baseUnit;

    if (unit === "ML") {
      return `${(qty / 1000).toLocaleString()} L`;
    }
    if (unit === "G") {
      return `${(qty / 1000).toLocaleString()} KG`;
    }
    return `${qty.toLocaleString()} items`;
  };

  const handleAdjustStock = () => {
    const adjustmentValue = parseFloat(adjustQty);
    if (isNaN(adjustmentValue) || adjustmentValue <= 0 || !adjustModal) return;

    const { productId, action } = adjustModal;
    const record = inventory.find((r) => r.id === productId);
    if (!record) return;

    // Convert display adjustment (KG/L) back to base (G/ML) if needed
    let baseAdjustment = adjustmentValue;
    if (record.baseUnit === "G" || record.baseUnit === "ML") {
      baseAdjustment = adjustmentValue * 1000; // Client specifies in L/KG
    }

    // Check subtraction safety
    if (action === "SUBTRACT" && record.totalQuantity < baseAdjustment) {
      toast({
        title: "Adjustment Failed",
        description: "Insufficient stock quantity in warehouse.",
        type: "error",
      });
      return;
    }

    setInventory((prev) =>
      prev.map((r) => {
        if (r.id === productId) {
          const delta = action === "ADD" ? baseAdjustment : -baseAdjustment;
          const updatedBatches = r.batches.map((b) => {
            // Apply simple adjustment to first batch for demo
            return {
              ...b,
              quantity: b.quantity + delta
            };
          });
          return {
            ...r,
            totalQuantity: r.totalQuantity + delta,
            batches: updatedBatches
          };
        }
        return r;
      })
    );

    toast({
      title: "Stock Level Adjusted",
      description: `Successfully ${action === "ADD" ? "added" : "subtracted"} ${adjustmentValue} ${record.baseUnit === "ITEM" ? "items" : record.baseUnit === "G" ? "KG" : "L"} of ${record.productName}.`,
      type: "success",
    });

    setAdjustModal(null);
  };

  const triggerAdjustment = (productId: string, action: "ADD" | "SUBTRACT") => {
    setAdjustModal({
      isOpen: true,
      productId,
      action
    });
    setAdjustQty("10");
  };

  return (
    <div className="space-y-6">
      {/* Low Stock Banners */}
      <AnimatePresence>
        {criticalItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h5 className="font-extrabold text-sm leading-none">Critical Stock Alerts</h5>
                <p className="text-xs mt-1 text-red-400">
                  The following chemical items are running critical low. Please generate supply quotes immediately:{" "}
                  <span className="font-bold underline">
                    {criticalItems.map((c) => `${c.productName} (${formatDisplayQty(c)})`).join(", ")}
                  </span>.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 1. Inventory Table list */}
        <Card className="lg:col-span-2 bg-card/40 backdrop-blur-md border-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Boxes className="h-5 w-5 text-primary" /> Stock Inventory Log
            </CardTitle>
            <CardDescription>
              Monitor aggregate quantities and stock health statuses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chemical</TableHead>
                  <TableHead>Formula</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Base Unit</TableHead>
                  <TableHead>Health status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((rec) => {
                  const status = getStockStatus(rec);
                  return (
                    <TableRow 
                      key={rec.id}
                      className={`hover:bg-muted/30 cursor-pointer ${selectedRecordId === rec.id ? "bg-muted/40" : ""}`}
                      onClick={() => setSelectedRecordId(rec.id)}
                    >
                      <TableCell className="font-bold">{rec.productName}</TableCell>
                      <TableCell className="font-mono text-xs">{rec.formula}</TableCell>
                      <TableCell className="font-extrabold">{formatDisplayQty(rec)}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{rec.baseUnit}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase ${status.color} ${status.bg}`}>
                          {status.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-emerald-500/10 text-emerald-500 cursor-pointer"
                            onClick={() => triggerAdjustment(rec.id, "ADD")}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-red-500/10 text-red-500 cursor-pointer"
                            onClick={() => triggerAdjustment(rec.id, "SUBTRACT")}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 2. Batch details Panel */}
        <Card className="bg-card/40 backdrop-blur-md border-border/80 h-fit">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-sm font-extrabold">Batch Audit Details</CardTitle>
            <CardDescription className="text-xs truncate">{selectedRecord.productName}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-3">
              {selectedRecord.batches.map((batch) => (
                <div key={batch.id} className="border rounded-xl p-4 bg-muted/10 text-xs space-y-2">
                  <div className="flex justify-between items-center font-bold text-foreground">
                    <span className="font-mono text-primary">{batch.batchNumber}</span>
                    <span className="text-muted-foreground">{batch.location}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground pt-1 border-t border-border/30">
                    <span>Batch Quantity</span>
                    <span className="font-extrabold text-foreground">
                      {selectedRecord.baseUnit === "ML" 
                        ? `${(batch.quantity / 1000).toFixed(2)} L`
                        : selectedRecord.baseUnit === "G"
                        ? `${(batch.quantity / 1000).toFixed(2)} KG`
                        : `${batch.quantity} items`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Batch Expiry</span>
                    <span className="font-bold text-foreground">{batch.expiry}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Adjust Stock Modal Overlay */}
      <AnimatePresence>
        {adjustModal?.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAdjustModal(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            />
            {/* Dialog panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm border bg-card p-6 rounded-xl shadow-2xl z-50 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-lg text-foreground flex items-center gap-2">
                  <Boxes className="h-5 w-5 text-primary" />
                  {adjustModal.action === "ADD" ? "Add Stock" : "Subtract Stock"}
                </h4>
                <button className="text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => setAdjustModal(null)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Adjustment value (in L, KG, or Items)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 50"
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1 cursor-pointer" onClick={() => setAdjustModal(null)}>
                  Cancel
                </Button>
                <Button className="flex-1 cursor-pointer" onClick={handleAdjustStock}>
                  Submit Adjustment
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
