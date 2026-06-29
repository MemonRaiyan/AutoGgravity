"use client";

import { Bell, User } from "lucide-react";
import { CommandPalette } from "./command-palette";

export function Navbar() {
  return (
    <div className="flex items-center p-4 h-16 border-b bg-background shadow-sm">
      <div className="flex items-center flex-1">
        <CommandPalette />
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
