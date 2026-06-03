import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ShoppingCart, Plus, Eye } from "lucide-react";

export default function SellerOrders() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Sales Orders</h1>
          <p className="text-muted-foreground text-sm">Create and review orders submitted on behalf of your chemical purchase accounts.</p>
        </div>
        <Button className="font-semibold cursor-pointer">
          <Plus className="mr-2 h-4 w-4" /> Create Sales Order
        </Button>
      </div>

      <Card className="bg-card/40 backdrop-blur-md border-border/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" /> My Placed Orders
          </CardTitle>
          <CardDescription>Order records submitted under your account representative ID.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Buyer Account</TableHead>
                <TableHead>Creation Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Shipping Status</TableHead>
                <TableHead className="text-right">Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-xs font-semibold">#ORD-9902</TableCell>
                <TableCell>Pfizer Chemical Sourcing</TableCell>
                <TableCell>2026-06-03</TableCell>
                <TableCell className="font-bold">$22,200.00</TableCell>
                <TableCell>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Awaiting Approval
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs font-semibold">#ORD-8851</TableCell>
                <TableCell>DuPont Industrial Lab</TableCell>
                <TableCell>2026-06-01</TableCell>
                <TableCell className="font-bold">$5,450.00</TableCell>
                <TableCell>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    In Production
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
