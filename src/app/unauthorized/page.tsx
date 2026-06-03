import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(220,38,38,0.08),rgba(255,255,255,0))] px-4 text-center">
      <div className="p-4 bg-destructive/10 rounded-full text-destructive mb-6">
        <ShieldX className="h-16 w-16" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">
        Access Denied
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        You do not have the required permissions to view this resource. Please verify your account privileges or log in with a different account.
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <Button variant="outline">Return to Sign In</Button>
        </Link>
      </div>
    </div>
  );
}
