import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ShoppingBag, Eye } from "lucide-react";

export default function UserOrders() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">My Purchase Orders</h1>
        <p className="text-muted-foreground text-sm">Review status, payment details, and shipping updates for your orders.</p>
      </div>

      <Card className="bg-card/40 backdrop-blur-md border-border/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" /> Submitted Purchase Orders
          </CardTitle>
          <CardDescription>Track chemical deliveries and status updates from the inventory manager.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Requested Date</TableHead>
                <TableHead>Order Value</TableHead>
                <TableHead>Delivery Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-xs font-semibold">#ORD-7718</TableCell>
                <TableCell>2026-06-03</TableCell>
                <TableCell className="font-bold">$850.00</TableCell>
                <TableCell>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Awaiting Verification
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-1.5" /> Details</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
