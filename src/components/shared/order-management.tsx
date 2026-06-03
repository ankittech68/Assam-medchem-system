"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { 
  ShoppingBag, Check, X, Shield, Eye, Calendar, User, DollarSign, Clock, CheckCircle2, AlertTriangle, AlertCircle 
} from "lucide-react";

type OrderStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

interface TimelineEvent {
  time: string;
  actor: string;
  action: string;
  details: string;
}

interface OrderItem {
  id: string;
  productName: string;
  formula: string;
  quantity: number;
  unit: string;
  price: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  role: string;
  company: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  client: CustomerInfo;
  items: OrderItem[];
  status: OrderStatus;
  timeline: TimelineEvent[];
}

const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-9902",
    date: "2026-06-03",
    client: { name: "Pfizer Buyer Sourcing", email: "pfizer@pfizer.com", role: "USER", company: "Pfizer Inc." },
    items: [
      { id: "item-1", productName: "Hydrochloric Acid (37%)", formula: "HCl", quantity: 1200, unit: "L", price: 18.50 },
    ],
    status: "PENDING",
    timeline: [
      { time: "2026-06-03 10:15:02", actor: "Pfizer Buyer Sourcing", action: "ORDER_SUBMITTED", details: "Order placed via online catalog" }
    ]
  },
  {
    id: "ord-2",
    orderNumber: "ORD-8851",
    date: "2026-06-01",
    client: { name: "Sales Rep Bob", email: "bob@chemflow.com", role: "SELLER", company: "DuPont Industrial Lab (Agent)" },
    items: [
      { id: "item-2", productName: "Ethanol (99.8%)", formula: "C2H5OH", quantity: 425, unit: "L", price: 12.80 },
    ],
    status: "APPROVED",
    timeline: [
      { time: "2026-06-01 14:10:00", actor: "Sales Rep Bob", action: "ORDER_CREATED", details: "Logged on behalf of DuPont Industrial" },
      { time: "2026-06-01 16:30:11", actor: "Admin Ankit", action: "ORDER_APPROVED", details: "Inventory allocation verification pass" }
    ]
  },
  {
    id: "ord-3",
    orderNumber: "ORD-7711",
    date: "2026-05-28",
    client: { name: "Pfizer Buyer Sourcing", email: "pfizer@pfizer.com", role: "USER", company: "Bayer Pharmaceuticals (Consolidated)" },
    items: [
      { id: "item-3", productName: "Sodium Hydroxide Pellets", formula: "NaOH", quantity: 200, unit: "KG", price: 8.20 },
      { id: "item-4", productName: "Sodium Chloride", formula: "NaCl", quantity: 500, unit: "G", price: 4.50 },
    ],
    status: "COMPLETED",
    timeline: [
      { time: "2026-05-28 09:30:00", actor: "Pfizer Buyer Sourcing", action: "ORDER_SUBMITTED", details: "Order submitted" },
      { time: "2026-05-28 11:15:00", actor: "Admin Ankit", action: "ORDER_APPROVED", details: "Order approved" },
      { time: "2026-05-30 16:45:00", actor: "Logistics Carrier", action: "ORDER_SHIPPED", details: "Consignment picked up" },
      { time: "2026-06-02 10:20:00", actor: "Bayer Sourcing Dept", action: "ORDER_COMPLETED", details: "Signature receipt validation logged" }
    ]
  }
];

export default function OrderManagement() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(INITIAL_ORDERS[0].id);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    orderId: string;
    targetStatus: OrderStatus;
  } | null>(null);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "APPROVED":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "REJECTED":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "COMPLETED":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4 shrink-0" />;
      case "APPROVED":
        return <CheckCircle2 className="h-4 w-4 shrink-0" />;
      case "REJECTED":
        return <AlertCircle className="h-4 w-4 shrink-0" />;
      case "COMPLETED":
        return <Check className="h-4 w-4 shrink-0" />;
    }
  };

  const calculateTotal = (order: Order) => {
    return order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const triggerStatusChange = (orderId: string, status: OrderStatus) => {
    setConfirmDialog({
      isOpen: true,
      orderId,
      targetStatus: status,
    });
  };

  const confirmStatusChange = () => {
    if (!confirmDialog) return;
    const { orderId, targetStatus } = confirmDialog;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
          const newEvent: TimelineEvent = {
            time: timestamp,
            actor: "Admin Ankit",
            action: `ORDER_${targetStatus}`,
            details: `Status modified manually to ${targetStatus}`
          };
          return {
            ...o,
            status: targetStatus,
            timeline: [...o.timeline, newEvent],
          };
        }
        return o;
      })
    );

    toast({
      title: "Order Status Updated",
      description: `Order ${selectedOrder.orderNumber} successfully set to ${targetStatus}.`,
      type: "success",
    });

    setConfirmDialog(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* 1. Orders Listing Panel */}
      <Card className="lg:col-span-2 bg-card/40 backdrop-blur-md border-border/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Active Sales Log
          </CardTitle>
          <CardDescription>
            Admin order dashboard to monitor and update buyer requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((ord) => (
                <TableRow 
                  key={ord.id} 
                  className={`hover:bg-muted/30 cursor-pointer ${selectedOrderId === ord.id ? "bg-muted/40 font-bold" : ""}`}
                  onClick={() => setSelectedOrderId(ord.id)}
                >
                  <TableCell className="font-mono text-xs">{ord.orderNumber}</TableCell>
                  <TableCell>{ord.client.company}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{ord.date}</TableCell>
                  <TableCell>${calculateTotal(ord).toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase ${getStatusBadgeClass(ord.status)}`}>
                      {getStatusIcon(ord.status)}
                      {ord.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1.5">
                      {ord.status === "PENDING" && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-emerald-500/10 text-emerald-500 cursor-pointer"
                            onClick={() => triggerStatusChange(ord.id, "APPROVED")}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-red-500/10 text-red-500 cursor-pointer"
                            onClick={() => triggerStatusChange(ord.id, "REJECTED")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {ord.status === "APPROVED" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 cursor-pointer font-bold text-xs"
                          onClick={() => triggerStatusChange(ord.id, "COMPLETED")}
                        >
                          Complete
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 cursor-pointer"
                        onClick={() => setSelectedOrderId(ord.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 2. Order Details & Activity Timeline Panel */}
      <div className="space-y-6">
        {/* Selected Order Summary */}
        <Card className="bg-card/40 backdrop-blur-md border-border/80 relative">
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-extrabold text-lg">{selectedOrder.orderNumber}</CardTitle>
                <CardDescription className="text-xs flex items-center gap-1 mt-0.5">
                  <Calendar className="h-3 w-3" /> Logged: {selectedOrder.date}
                </CardDescription>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeClass(selectedOrder.status)}`}>
                {selectedOrder.status}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* Customer Box */}
            <div className="bg-muted/20 border rounded-xl p-3 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <User className="h-3.5 w-3.5 text-primary" /> Client Profile
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{selectedOrder.client.name}</p>
                <p className="text-muted-foreground">{selectedOrder.client.email}</p>
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold uppercase tracking-wider">
                  <Shield className="h-2.5 w-2.5" /> {selectedOrder.client.role}
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Line Items</h5>
              <div className="space-y-2">
                {selectedOrder.items.map((it) => (
                  <div key={it.id} className="flex justify-between items-center text-xs p-2.5 bg-muted/10 border rounded-lg">
                    <div>
                      <p className="font-bold text-foreground">{it.productName}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{it.formula} • {it.quantity} {it.unit}</p>
                    </div>
                    <span className="font-bold text-foreground">${(it.quantity * it.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-center bg-primary/10 text-primary border border-primary/20 rounded-xl px-4 py-2.5 font-bold">
              <span className="flex items-center gap-1.5"><DollarSign className="h-4.5 w-4.5" /> Order Total</span>
              <span>${calculateTotal(selectedOrder).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Vertical Activity Timeline */}
        <Card className="bg-card/40 backdrop-blur-md border-border/80">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-sm font-extrabold flex items-center gap-1.5">
              <Clock className={`h-4.5 w-4.5 ${
                selectedOrder.status === "APPROVED" || selectedOrder.status === "COMPLETED"
                  ? "text-emerald-500"
                  : selectedOrder.status === "REJECTED"
                  ? "text-red-500"
                  : "text-primary"
              }`} /> Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {(() => {
              const isGreen = selectedOrder.status === "APPROVED" || selectedOrder.status === "COMPLETED";
              const isRed = selectedOrder.status === "REJECTED";
              const dotColor = isGreen ? "bg-emerald-500 border-emerald-600" : isRed ? "bg-red-500 border-red-600" : "bg-primary border-primary/85";
              const labelColor = isGreen ? "text-emerald-500" : isRed ? "text-red-500" : "text-primary";

              return (
                <div className="relative pl-6 space-y-5">
                  {/* Timeline running track line */}
                  <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-border/60 overflow-hidden rounded-full">
                    {isGreen && (
                      <div className="absolute inset-0 bg-emerald-500/20">
                        <div 
                          className="w-full h-1/2 bg-gradient-to-b from-transparent via-emerald-500 to-transparent animate-[timeline-flow_2s_linear_infinite]"
                        />
                      </div>
                    )}
                    {isRed && (
                      <div className="absolute inset-0 bg-red-500/50" />
                    )}
                  </div>

                  {selectedOrder.timeline.map((ev, idx) => {
                    const isLatest = idx === selectedOrder.timeline.length - 1;
                    return (
                      <div key={idx} className="relative text-xs">
                        {/* Pulse Ring for active running latest state */}
                        {isLatest && (
                          <span className={`absolute -left-[34px] top-[1px] h-5 w-5 rounded-full border animate-ping opacity-60 ${
                            isGreen ? "border-emerald-500 bg-emerald-500/20" : isRed ? "border-red-500 bg-red-500/20" : "border-primary bg-primary/20"
                          }`} />
                        )}

                        {/* Circle marker */}
                        <span className={`absolute -left-[30px] top-1.5 h-3 w-3 rounded-full border-2 border-background ${dotColor}`} />
                        
                        <div className="flex justify-between items-center text-muted-foreground text-[10px]">
                          <span className={`font-bold ${labelColor}`}>{ev.action}</span>
                          <span className="font-mono">{ev.time}</span>
                        </div>
                        <p className="font-semibold text-foreground mt-0.5">{ev.actor}</p>
                        <p className="text-muted-foreground mt-0.5">{ev.details}</p>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog Overlay */}
      <AnimatePresence>
        {confirmDialog?.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDialog(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            />
            {/* Dialog panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm border bg-card p-6 rounded-xl shadow-2xl z-50 text-center space-y-4"
            >
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-full w-fit mx-auto">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-foreground">Verify Status Change</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Change order status to <span className="font-bold text-primary">{confirmDialog.targetStatus}</span>? This will lock in inventory changes.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 cursor-pointer" onClick={() => setConfirmDialog(null)}>
                  Cancel
                </Button>
                <Button className="flex-1 cursor-pointer" onClick={confirmStatusChange}>
                  Confirm
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
