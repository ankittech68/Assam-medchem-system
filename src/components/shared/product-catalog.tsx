"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { 
  FlaskConical, Grid, List, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Inbox, ShoppingCart, FileText, Edit3 
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  formula: string;
  casNumber: string;
  grade: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
}

interface ProductCatalogProps {
  role: "ADMIN" | "SELLER" | "USER";
  onActionClick?: (product: Product, actionType: "edit" | "quote" | "order") => void;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "1", name: "Hydrochloric Acid (37%)", formula: "HCl", casNumber: "7647-01-0", grade: "Analytical Reagent", category: "Acids", price: 18.50, stock: 1200, unit: "L" },
  { id: "2", name: "Ethanol (99.8%)", formula: "C2H5OH", casNumber: "64-17-5", grade: "USP Grade", category: "Solvents", price: 12.80, stock: 850, unit: "L" },
  { id: "3", name: "Sodium Hydroxide Pellets", formula: "NaOH", casNumber: "1310-73-2", grade: "Technical Grade", category: "Bases", price: 8.20, stock: 45, unit: "KG" },
  { id: "4", name: "Acetone", formula: "CH3COCH3", casNumber: "67-64-1", grade: "HPLC Grade", category: "Solvents", price: 22.00, stock: 0, unit: "L" },
  { id: "5", name: "Sulfuric Acid (98%)", formula: "H2SO4", casNumber: "7664-93-9", grade: "ACS Reagent", category: "Acids", price: 24.50, stock: 350, unit: "L" },
  { id: "6", name: "Sodium Chloride", formula: "NaCl", casNumber: "7647-14-5", grade: "USP Grade", category: "Salts", price: 4.50, stock: 2500, unit: "G" },
  { id: "7", name: "Nitric Acid (68%)", formula: "HNO3", casNumber: "7697-37-2", grade: "Analytical Reagent", category: "Acids", price: 31.00, stock: 15, unit: "L" },
  { id: "8", name: "Methanol", formula: "CH3OH", casNumber: "67-56-1", grade: "Anhydrous", category: "Solvents", price: 14.20, stock: 400, unit: "L" },
];

const CATEGORIES = ["All", "Solvents", "Acids", "Bases", "Salts"];
const UNITS = ["All", "G", "KG", "ML", "L"];

export default function ProductCatalog({ role, onActionClick }: ProductCatalogProps) {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedUnit, setSelectedUnit] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 6;

  // Trigger simulated loader when parameters change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedUnit, sortBy, sortOrder]);

  const handleSort = (field: "name" | "price" | "stock") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Filter & Sort math
  const filteredProducts = INITIAL_PRODUCTS.filter((prod) => {
    const matchesSearch = 
      prod.name.toLowerCase().includes(search.toLowerCase()) ||
      prod.formula.toLowerCase().includes(search.toLowerCase()) ||
      prod.casNumber.includes(search);
    const matchesCategory = selectedCategory === "All" || prod.category === selectedCategory;
    const matchesUnit = selectedUnit === "All" || prod.unit === selectedUnit;
    return matchesSearch && matchesCategory && matchesUnit;
  }).sort((a, b) => {
    let comparison = 0;
    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "price") {
      comparison = a.price - b.price;
    } else if (sortBy === "stock") {
      comparison = a.stock - b.stock;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Paginated chunk
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleAction = (product: Product, type: "edit" | "quote" | "order") => {
    if (onActionClick) {
      onActionClick(product, type);
    } else {
      toast({
        title: "Action Logged",
        description: `${type.toUpperCase()} clicked for ${product.name}`,
        type: "success",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search catalog by CAS#, formula, or name..."
            className="pl-9 bg-card/40 border-border/80 h-9.5"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* View toggles & filter buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 border border-border/80 bg-card/40 p-1.5 rounded-lg text-xs font-semibold text-muted-foreground select-none">
            <Filter className="h-3.5 w-3.5" />
            <span>Cat:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-foreground font-bold focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="dark:bg-slate-900">{cat}</option>
              ))}
            </select>
          </div>

          {/* Unit Dropdown */}
          <div className="flex items-center gap-1.5 border border-border/80 bg-card/40 p-1.5 rounded-lg text-xs font-semibold text-muted-foreground select-none">
            <Filter className="h-3.5 w-3.5" />
            <span>Unit:</span>
            <select
              value={selectedUnit}
              onChange={(e) => {
                setSelectedUnit(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-foreground font-bold focus:outline-none cursor-pointer"
            >
              {UNITS.map((unit) => (
                <option key={unit} value={unit} className="dark:bg-slate-900">{unit}</option>
              ))}
            </select>
          </div>

          {/* Layout switches */}
          <div className="flex items-center border border-border/80 bg-card/40 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md cursor-pointer ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md cursor-pointer ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Display Area */}
      <div className="min-h-[400px]">
        {loading ? (
          /* Pulsing Skeletons */
          viewMode === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-56 bg-muted/40 rounded-xl border border-border/60 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3 bg-muted/10 p-4 rounded-xl border border-border/60">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-muted/40 rounded-md animate-pulse" />
              ))}
            </div>
          )
        ) : paginatedProducts.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center p-12 border border-dashed rounded-2xl border-border bg-slate-500/5 min-h-[350px]"
          >
            <div className="p-4 bg-muted/40 rounded-full text-muted-foreground mb-4">
              <Inbox className="h-12 w-12" />
            </div>
            <h3 className="font-bold text-lg text-foreground">No Chemicals Found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1">
              We couldn&apos;t find any chemicals matching your search or filters. Try adjusting your query or tags.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 font-semibold cursor-pointer"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setSelectedUnit("All");
              }}
            >
              Reset Filters
            </Button>
          </motion.div>
        ) : viewMode === "grid" ? (
          /* Card View Layout */
          <motion.div 
            layout
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {paginatedProducts.map((prod) => (
                <motion.div
                  key={prod.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full bg-card/40 border-border/80 flex flex-col hover:border-primary/40 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                          <FlaskConical className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-primary/10 text-primary border border-primary/20">
                          {prod.grade}
                        </span>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-extrabold text-foreground group-hover:text-primary transition-colors duration-200 truncate">{prod.name}</h4>
                        <span className="font-mono text-xs text-muted-foreground block mt-0.5">{prod.formula}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 pb-4">
                      <div className="flex justify-between items-center text-xs border-b border-border/40 pb-2 mb-2">
                        <span className="text-muted-foreground">CAS Number</span>
                        <span className="font-mono font-semibold">{prod.casNumber || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-semibold">{prod.category}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs mt-2">
                        <span className="text-muted-foreground">Available Stock</span>
                        <span className={`font-bold ${prod.stock === 0 ? "text-red-500" : prod.stock < 50 ? "text-amber-500" : "text-emerald-500"}`}>
                          {prod.stock} {prod.unit}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t border-border/30 pt-4 pb-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">Unit Price</span>
                        <span className="font-extrabold text-lg text-foreground">${prod.price.toFixed(2)}<span className="text-xs text-muted-foreground font-normal"> / {prod.unit}</span></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {role === "ADMIN" && (
                          <Button size="sm" variant="outline" className="cursor-pointer" onClick={() => handleAction(prod, "edit")}>
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {role === "SELLER" && (
                          <>
                            <Button size="sm" variant="outline" className="cursor-pointer" onClick={() => handleAction(prod, "quote")}>
                              <FileText className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="sm" className="cursor-pointer" onClick={() => handleAction(prod, "order")}>
                              <ShoppingCart className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                        {role === "USER" && (
                          <Button size="sm" className="cursor-pointer" disabled={prod.stock === 0} onClick={() => handleAction(prod, "order")}>
                            <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Order
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Table View Layout */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-border/80 rounded-xl bg-card/20 backdrop-blur-md overflow-hidden"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-1">
                      Chemical Name <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Formula</TableHead>
                  <TableHead>CAS Number</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("stock")}>
                    <div className="flex items-center gap-1">
                      Available Stock <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("price")}>
                    <div className="flex items-center gap-1">
                      Unit Price <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((prod) => (
                  <TableRow key={prod.id} className="hover:bg-muted/30">
                    <TableCell className="font-bold">{prod.name}</TableCell>
                    <TableCell className="font-mono text-xs">{prod.formula}</TableCell>
                    <TableCell className="font-mono text-xs">{prod.casNumber}</TableCell>
                    <TableCell>{prod.grade}</TableCell>
                    <TableCell className={`font-semibold ${prod.stock === 0 ? "text-red-500" : prod.stock < 50 ? "text-amber-500" : "text-emerald-500"}`}>
                      {prod.stock} {prod.unit}
                    </TableCell>
                    <TableCell className="font-bold">${prod.price.toFixed(2)} / {prod.unit}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        {role === "ADMIN" && (
                          <Button size="sm" variant="ghost" className="h-8 cursor-pointer" onClick={() => handleAction(prod, "edit")}>
                            Edit
                          </Button>
                        )}
                        {role === "SELLER" && (
                          <>
                            <Button size="sm" variant="outline" className="h-8 cursor-pointer" onClick={() => handleAction(prod, "quote")}>
                              Quote
                            </Button>
                            <Button size="sm" className="h-8 cursor-pointer" onClick={() => handleAction(prod, "order")}>
                              Order
                            </Button>
                          </>
                        )}
                        {role === "USER" && (
                          <Button size="sm" className="h-8 cursor-pointer" disabled={prod.stock === 0} onClick={() => handleAction(prod, "order")}>
                            Add to Order
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/40 pt-4 select-none">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{(page - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-semibold text-foreground">{Math.min(page * itemsPerPage, filteredProducts.length)}</span> of{" "}
            <span className="font-semibold text-foreground">{filteredProducts.length}</span> items
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 cursor-pointer font-bold"
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
