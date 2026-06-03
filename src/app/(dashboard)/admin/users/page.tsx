import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Users, UserX, Shield } from "lucide-react";

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">User Administration</h1>
        <p className="text-muted-foreground text-sm">Review, audit registration actions, and update system roles for admins, sellers, and client users.</p>
      </div>

      <Card className="bg-card/40 backdrop-blur-md border-border/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Active Accounts Registry
          </CardTitle>
          <CardDescription>Accounts currently registered on the ChemFlow platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Assigned Role</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-xs text-muted-foreground">#usr-c5b9f91a</TableCell>
                <TableCell className="font-bold">Ankit</TableCell>
                <TableCell>ankit@chemflow.com</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20">
                    <Shield className="h-3 w-3" /> ADMIN
                  </span>
                </TableCell>
                <TableCell>2026-06-03</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-500/10"><UserX className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs text-muted-foreground">#usr-d128b9aa</TableCell>
                <TableCell className="font-bold">Sales Rep Bob</TableCell>
                <TableCell>bob@chemflow.com</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <Shield className="h-3 w-3" /> SELLER
                  </span>
                </TableCell>
                <TableCell>2026-06-03</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-500/10"><UserX className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs text-muted-foreground">#usr-0089efb1</TableCell>
                <TableCell className="font-bold">Pfizer Buyer Sourcing</TableCell>
                <TableCell>pfizer@pfizer.com</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-500 border border-slate-500/20">
                    <Shield className="h-3 w-3" /> USER
                  </span>
                </TableCell>
                <TableCell>2026-06-03</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-500/10"><UserX className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
