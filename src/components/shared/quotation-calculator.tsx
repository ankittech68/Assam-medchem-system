"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { calculatePrice, convertUnit, getUnitDimension } from "@/lib/unit-converter";
import { useToast } from "@/components/ui/toast";
import { Prisma, Unit } from "@prisma/client";
import { Calculator, AlertCircle, FileText, FlaskConical, DollarSign } from "lucide-react";

interface ProductOption {
  id: string;
  name: string;
  formula: string;
  casNumber: string;
  grade: string;
  price: number; // Catalog Price per Base Unit
  unit: Unit;    // Base Pricing Unit
}

const PRODUCTS: ProductOption[] = [
  { id: "1", name: "Hydrochloric Acid (37%)", formula: "HCl", casNumber: "7647-01-0", grade: "Analytical Reagent", price: 18.50, unit: "L" },
  { id: "2", name: "Ethanol (99.8%)", formula: "C2H5OH", casNumber: "64-17-5", grade: "USP Grade", price: 12.80, unit: "L" },
  { id: "3", name: "Sodium Hydroxide Pellets", formula: "NaOH", casNumber: "1310-73-2", grade: "Technical Grade", price: 8.20, unit: "KG" },
  { id: "4", name: "Sodium Chloride", formula: "NaCl", casNumber: "7647-14-5", grade: "USP Grade", price: 4.50, unit: "G" },
];

const TAX_RATE = 0.18; // 18% standard chemical tax

export default function QuotationCalculator() {
  const { toast } = useToast();
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [quantity, setQuantity] = useState("1");
  const [selectedUnit, setSelectedUnit] = useState<Unit>("L");
  const [availableUnits, setAvailableUnits] = useState<Unit[]>(["L", "ML"]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Live calculation results
  const [results, setResults] = useState<{
    equivalentQty: string;
    subtotal: number;
    taxes: number;
    total: number;
  } | null>(null);

  const selectedProduct = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  // Adjust available units based on product dimension
  useEffect(() => {
    const dim = getUnitDimension(selectedProduct.unit);
    let units: Unit[] = [];
    if (dim === "WEIGHT") {
      units = ["G", "KG"];
      // Auto switch selected unit if incompatible
      if (!["G", "KG"].includes(selectedUnit)) {
        setSelectedUnit("KG");
      }
    } else if (dim === "VOLUME") {
      units = ["ML", "L"];
      if (!["ML", "L"].includes(selectedUnit)) {
        setSelectedUnit("L");
      }
    } else {
      units = ["ITEM"];
      setSelectedUnit("ITEM");
    }
    setAvailableUnits(units);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductId]);

  // Recalculate in real time
  useEffect(() => {
    setErrorMsg(null);
    const qtyNum = parseFloat(quantity);
    
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setResults(null);
      return;
    }

    try {
      const quantityDec = new Prisma.Decimal(qtyNum);
      const catalogPriceDec = new Prisma.Decimal(selectedProduct.price);
      
      // Calculate total subtotal using exact Decimal conversion engine
      const subtotalDec = calculatePrice(
        catalogPriceDec,
        quantityDec,
        selectedUnit,
        selectedProduct.unit
      );

      // Get display equivalent in product base unit
      const equivalentQtyDec = convertUnit(quantityDec, selectedUnit, selectedProduct.unit);
      
      const subtotalVal = subtotalDec.toNumber();
      const taxesVal = subtotalVal * TAX_RATE;
      const totalVal = subtotalVal + taxesVal;

      setResults({
        equivalentQty: `${equivalentQtyDec.toFixed(4)} ${selectedProduct.unit}`,
        subtotal: subtotalVal,
        taxes: taxesVal,
        total: totalVal,
      });
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || "Math error inside Conversion Engine");
      setResults(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductId, quantity, selectedUnit]);

  const handleSaveQuote = () => {
    if (!results) return;
    toast({
      title: "Quotation Generated",
      description: `Drafted quote for ${quantity} ${selectedUnit} of ${selectedProduct.name} at $${results.total.toFixed(2)} (Tax Included).`,
      type: "success",
    });
  };

  return (
    <Card className="bg-card/40 backdrop-blur-md border-border/80 shadow-lg relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Interactive Quote Estimator
        </CardTitle>
        <CardDescription>
          Compute compliant chemical quantities and exact contract pricing dynamically.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Row 1: Product Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Chemical Product
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground dark:bg-card/90 cursor-pointer"
          >
            {PRODUCTS.map((prod) => (
              <option key={prod.id} value={prod.id} className="dark:bg-slate-900">
                {prod.name} ({prod.formula}) - ${prod.price.toFixed(2)}/{prod.unit}
              </option>
            ))}
          </select>
        </div>

        {/* Row 2: Quantity & Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quantity
            </label>
            <Input
              type="number"
              placeholder="e.g. 500"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-card/40 border-border/60"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Unit
            </label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value as Unit)}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground dark:bg-card/90 cursor-pointer"
            >
              {availableUnits.map((u) => (
                <option key={u} value={u} className="dark:bg-slate-900">
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error warnings if compatibility check crashes */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-xs font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Pricing Summary Panels */}
        <AnimatePresence mode="wait">
          {results ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 pt-4 border-t border-border/40 text-sm overflow-hidden"
            >
              <div className="flex justify-between items-center text-xs text-muted-foreground bg-slate-500/5 px-3 py-1.5 rounded-lg border border-border/30">
                <span className="flex items-center gap-1"><FlaskConical className="h-3.5 w-3.5" /> Base Equivalent</span>
                <span className="font-mono font-bold text-foreground">{results.equivalentQty}</span>
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">${results.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center px-1 text-xs">
                <span className="text-muted-foreground">Compliance Tax (18%)</span>
                <span className="font-semibold text-amber-500">${results.taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl mt-2 font-bold text-base">
                <span className="flex items-center gap-1.5"><DollarSign className="h-4.5 w-4.5" /> Est. Contract Total</span>
                <span>${results.total.toFixed(2)}</span>
              </div>
            </motion.div>
          ) : (
            <div className="text-center text-xs text-muted-foreground py-6 border-t border-dashed mt-4">
              Enter a valid quantity to calculate pricing.
            </div>
          )}
        </AnimatePresence>
      </CardContent>

      <CardFooter className="bg-muted/10 border-t border-border/40 py-4 flex justify-end">
        <Button 
          onClick={handleSaveQuote} 
          disabled={!results} 
          className="font-semibold cursor-pointer w-full sm:w-auto"
        >
          <FileText className="mr-2 h-4 w-4" /> Save Quotation Draft
        </Button>
      </CardFooter>
    </Card>
  );
}
