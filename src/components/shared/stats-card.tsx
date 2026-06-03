import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: React.ReactNode;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export default function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow bg-card/40 backdrop-blur-md border-border/80">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-extrabold tracking-tight">{value}</h3>
          {(description || trend) && (
            <div className="flex items-center gap-2 mt-1">
              {trend && (
                <span className={`text-xs font-bold ${trend.positive ? "text-emerald-500" : "text-red-500"}`}>
                  {trend.value}
                </span>
              )}
              {description && <span className="text-xs text-muted-foreground">{description}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
