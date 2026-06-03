"use client";

import React, { useState } from "react";
import StatsCard from "@/components/shared/stats-card";
import AnimatedCounter from "@/components/shared/animated-counter";
import SalesChart from "@/components/charts/sales-chart";
import OrdersChart from "@/components/charts/orders-chart";
import InventoryChart from "@/components/charts/inventory-chart";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { 
  FlaskConical, ClipboardList, TrendingUp, Users, Inbox, Activity, Sliders, AlertTriangle 
} from "lucide-react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // Trigger brief simulated loader on toggles
  const handleToggleLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="space-y-6">
      {/* SaaS Dashboard Simulator Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-primary/5 border border-primary/10 rounded-xl p-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Console</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time compliance analytics and chemical stock metrics.
          </p>
        </div>
        {/* Simulator controls */}
        <div className="flex items-center gap-3 bg-card/60 backdrop-blur-md p-1.5 border border-border/80 rounded-lg text-xs font-semibold text-muted-foreground select-none">
          <Sliders className="h-3.5 w-3.5" />
          <span>UX Simulator:</span>
          <label className="flex items-center gap-1 cursor-pointer hover:text-foreground">
            <input
              type="checkbox"
              checked={loading}
              onChange={handleToggleLoading}
              className="rounded border-border focus:ring-primary accent-primary"
            />
            <span>Skeletons</span>
          </label>
          <div className="w-[1px] h-3.5 bg-border" />
          <label className="flex items-center gap-1 cursor-pointer hover:text-foreground">
            <input
              type="checkbox"
              checked={isEmpty}
              onChange={(e) => setIsEmpty(e.target.checked)}
              className="rounded border-border focus:ring-primary accent-primary"
            />
            <span>Empty States</span>
          </label>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          /* Metric Skeletons */
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted/40 rounded-xl border border-border animate-pulse" />
          ))
        ) : isEmpty ? (
          /* Empty metrics */
          <>
            <StatsCard title="Total Products" value="0" icon={FlaskConical} />
            <StatsCard title="Total Orders" value="0" icon={ClipboardList} />
            <StatsCard title="Total Quotations" value="0" icon={Users} />
            <StatsCard title="Total Revenue" value="$0.00" icon={TrendingUp} />
          </>
        ) : (
          /* Animated active metrics */
          <>
            <StatsCard
              title="Total Products"
              value={<AnimatedCounter value={1248} />}
              description="items tracked"
              icon={FlaskConical}
              trend={{ value: "+12% this month", positive: true }}
            />
            <StatsCard
              title="Total Orders"
              value={<AnimatedCounter value={705} />}
              description="completed batches"
              icon={ClipboardList}
              trend={{ value: "-4% this week", positive: true }}
            />
            <StatsCard
              title="Total Quotations"
              value={<AnimatedCounter value={432} />}
              description="active contract drafts"
              icon={Users}
              trend={{ value: "+8 today", positive: true }}
            />
            <StatsCard
              title="Total Revenue"
              value={<AnimatedCounter value={132450} prefix="$" />}
              description="gross earnings"
              icon={TrendingUp}
              trend={{ value: "+28.4% vs last mo", positive: true }}
            />
          </>
        )}
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart 1: Revenue line */}
        <Card className="lg:col-span-4 bg-card/40 backdrop-blur-md border-border/80">
          <CardHeader>
            <CardTitle>Revenue by Month</CardTitle>
            <CardDescription>Aggregate billing values over the past 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] w-full bg-muted/30 rounded-lg animate-pulse" />
            ) : isEmpty ? (
              <div className="h-[300px] w-full flex flex-col items-center justify-center text-xs text-muted-foreground">
                <Inbox className="h-8 w-8 mb-2" /> No revenue logged.
              </div>
            ) : (
              <SalesChart />
            )}
          </CardContent>
        </Card>

        {/* Chart 2: Categories distribution */}
        <Card className="lg:col-span-3 bg-card/40 backdrop-blur-md border-border/80">
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
            <CardDescription>Stock allocation by chemical family group.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] w-full bg-muted/30 rounded-lg animate-pulse" />
            ) : isEmpty ? (
              <div className="h-[300px] w-full flex flex-col items-center justify-center text-xs text-muted-foreground">
                <Inbox className="h-8 w-8 mb-2" /> No classification data.
              </div>
            ) : (
              <InventoryChart />
            )}
          </CardContent>
        </Card>

        {/* Chart 3: Orders bar chart */}
        <Card className="lg:col-span-7 bg-card/40 backdrop-blur-md border-border/80">
          <CardHeader>
            <CardTitle>Orders by Month</CardTitle>
            <CardDescription>Monthly distribution of purchase transactions completed.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] w-full bg-muted/30 rounded-lg animate-pulse" />
            ) : isEmpty ? (
              <div className="h-[300px] w-full flex flex-col items-center justify-center text-xs text-muted-foreground">
                <Inbox className="h-8 w-8 mb-2" /> No order history.
              </div>
            ) : (
              <OrdersChart />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Safety & Compliance Log */}
      <Card className="bg-card/40 backdrop-blur-md border-border/80">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Compliance Log & Audit Trail
            </CardTitle>
            <CardDescription>Audit logging of stock changes, status overrides, and user sign-ins.</CardDescription>
          </div>
          {!loading && !isEmpty && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-semibold select-none">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>2 Stock Warning</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            /* Table Skeletons */
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 bg-muted/40 rounded animate-pulse" />
              ))}
            </div>
          ) : isEmpty ? (
            /* Table Empty State */
            <div className="flex flex-col items-center justify-center text-center p-8 min-h-[150px] text-muted-foreground">
              <Inbox className="h-10 w-10 mb-2" />
              <p className="text-sm font-semibold">No audit logs stored</p>
              <p className="text-xs text-muted-foreground">Activity logs will print here upon database mutations.</p>
            </div>
          ) : (
            /* Table Output */
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User Account</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Summary details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-xs text-muted-foreground">2026-06-03 10:52:11</TableCell>
                  <TableCell className="font-bold">Ankit (Admin)</TableCell>
                  <TableCell className="text-emerald-500 font-bold">INV_SYNC</TableCell>
                  <TableCell className="text-muted-foreground">Restructured PostgreSQL schema to NUMERIC precision</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-xs text-muted-foreground">2026-06-03 10:48:02</TableCell>
                  <TableCell className="font-bold">Sales Bob</TableCell>
                  <TableCell className="text-primary font-bold">QUOTE_SEND</TableCell>
                  <TableCell className="text-muted-foreground">Quotation generated: 1.5 KG Sodium Hydroxide Pellets</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-xs text-muted-foreground">2026-06-03 10:30:59</TableCell>
                  <TableCell className="font-bold">Pfizer Buyer</TableCell>
                  <TableCell className="text-indigo-500 font-bold">LOGIN_OK</TableCell>
                  <TableCell className="text-muted-foreground">Session token issued under user role USER</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
