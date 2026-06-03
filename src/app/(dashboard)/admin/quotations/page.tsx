import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { FileSignature, Send, Download } from "lucide-react";

export default function AdminQuotations() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Quotations</h1>
        <p className="text-muted-foreground text-sm">Review, track responses, or reject custom bulk-pricing chemical quotation requests.</p>
      </div>

      <Card className="bg-card/40 backdrop-blur-md border-border/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5 text-primary" /> Active Pricing Quotations
          </CardTitle>
          <CardDescription>Chemical cost calculations sent to clients or drafted by sales representatives.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote #</TableHead>
                <TableHead>Target Client</TableHead>
                <TableHead>Valid Until</TableHead>
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
                    Sent
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary"><Send className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs font-semibold">#QT-2026-003</TableCell>
                <TableCell>DuPont Industrial Lab</TableCell>
                <TableCell>2026-06-15</TableCell>
                <TableCell className="font-bold">$4,800.00</TableCell>
                <TableCell>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Accepted
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs font-semibold">#QT-2026-002</TableCell>
                <TableCell>Merck Research Hub</TableCell>
                <TableCell>2026-05-10</TableCell>
                <TableCell className="font-bold">$12,500.00</TableCell>
                <TableCell>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20">
                    Expired
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
