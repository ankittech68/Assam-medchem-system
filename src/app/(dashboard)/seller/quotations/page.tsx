import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { FileSignature, Plus, Mail } from "lucide-react";

export default function SellerQuotations() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Contract Quotations</h1>
          <p className="text-muted-foreground text-sm">Prepare custom discount contracts or follow up on client quotation reviews.</p>
        </div>
        <Button className="font-semibold cursor-pointer">
          <Plus className="mr-2 h-4 w-4" /> Create Quotation
        </Button>
      </div>

      <Card className="bg-card/40 backdrop-blur-md border-border/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5 text-primary" /> My Active Quotations
          </CardTitle>
          <CardDescription>Quotations prepared under your account representative ID.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote Reference</TableHead>
                <TableHead>Client Account</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-xs font-semibold">#QT-2026-004</TableCell>
                <TableCell>Pfizer Chemical Sourcing</TableCell>
                <TableCell>2026-06-30</TableCell>
                <TableCell className="font-bold">$18,400.00</TableCell>
                <TableCell>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    Awaiting Client
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10"><Mail className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs font-semibold">#QT-2026-003</TableCell>
                <TableCell>DuPont Industrial Lab</TableCell>
                <TableCell>2026-06-15</TableCell>
                <TableCell className="font-bold">$4,800.00</TableCell>
                <TableCell>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Approved
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" disabled>Approved</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
