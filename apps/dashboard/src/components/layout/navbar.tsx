"use client";

import { Bell, Search, User } from "lucide-react";

export function Navbar() {
  return (
    <div className="flex items-center p-4 h-16 border-b bg-background shadow-sm">
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full bg-muted/50 rounded-md pl-9 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full hover:bg-muted transition">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 border-2 border-background" />
        </button>
        <button className="p-2 rounded-full hover:bg-muted transition">
          <User className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
