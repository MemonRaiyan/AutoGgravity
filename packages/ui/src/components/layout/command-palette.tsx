"use client";
import * as React from "react";
import { Search } from "lucide-react";

export function CommandPalette() {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="relative w-full max-w-md hidden md:flex items-center bg-muted/50 rounded-md px-3 py-2 text-sm cursor-text hover:bg-muted/80 transition-all border border-transparent hover:border-border"
      >
        <Search className="h-4 w-4 text-muted-foreground mr-2" />
        <span className="text-muted-foreground flex-1 text-left">Search documentation or features...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed left-[50%] top-[20%] z-50 grid w-full max-w-lg translate-x-[-50%] gap-4 border bg-background p-0 shadow-lg sm:rounded-lg"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input 
                autoFocus
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Type a command or search..."
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2 text-sm text-muted-foreground">
               <div className="p-4 text-center">No results found.</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
