import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <AlertCircle className="h-16 w-16 text-muted-foreground" />
      <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
      <p className="text-muted-foreground">The page you are looking for does not exist.</p>
      <Link href="/dashboard" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition">
        Return Home
      </Link>
    </div>
  );
}
