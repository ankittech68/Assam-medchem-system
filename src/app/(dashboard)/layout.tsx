import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";
import Breadcrumbs from "@/components/shared/breadcrumbs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar navigation */}
      <Sidebar user={session.user} />

      {/* Main page panel */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top toolbar */}
        <Navbar />

        {/* Dynamic page content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 mt-16 md:mt-0">
          <div className="mx-auto max-w-7xl space-y-6">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
