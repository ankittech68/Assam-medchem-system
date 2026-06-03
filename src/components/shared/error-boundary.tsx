"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an exception:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-6 border border-destructive/20 rounded-xl bg-destructive/5 backdrop-blur-md flex flex-col items-center text-center space-y-4 max-w-lg mx-auto my-6">
          <div className="p-3 bg-destructive/10 text-destructive rounded-full">
            <AlertOctagon className="h-10 w-10 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-foreground">Widget Crash</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              An unexpected exception occurred inside this interactive section.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={this.handleReset} className="font-semibold cursor-pointer">
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset Interface
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
