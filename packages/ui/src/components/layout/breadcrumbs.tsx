"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  if (paths.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      <Link href="/dashboard" className="hover:text-foreground transition">
        <Home className="h-4 w-4" />
      </Link>
      {paths.map((path, index) => (
        <div key={path} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4" />
          <span className={index === paths.length - 1 ? "text-foreground font-medium capitalize" : "capitalize"}>
            {path.replace(/-/g, ' ')}
          </span>
        </div>
      ))}
    </div>
  );
}
