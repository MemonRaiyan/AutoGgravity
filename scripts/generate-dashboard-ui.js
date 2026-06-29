const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../apps/dashboard/src');
const appDir = path.join(srcDir, 'app');
const componentsDir = path.join(srcDir, 'components');

// Create directories
[
  appDir,
  componentsDir,
  path.join(componentsDir, 'layout'),
  path.join(componentsDir, 'providers')
].forEach(dir => fs.mkdirSync(dir, { recursive: true }));

// Theme Provider
const themeProvider = `"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
`;
fs.writeFileSync(path.join(componentsDir, 'providers', 'theme-provider.tsx'), themeProvider);

// Sidebar
const sidebar = `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Upload, ListVideo, BarChart3, 
  Share2, Bot, CalendarClock, ScrollText, Settings 
} from "lucide-react";

// Fallback for cn if utils is missing
const cn = (...classes) => classes.filter(Boolean).join(' ');

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", color: "text-sky-500" },
  { label: "Uploads", icon: Upload, href: "/uploads", color: "text-violet-500" },
  { label: "Queue", icon: ListVideo, href: "/queue", color: "text-pink-700" },
  { label: "Analytics", icon: BarChart3, href: "/analytics", color: "text-orange-700" },
  { label: "Channels", icon: Share2, href: "/channels", color: "text-emerald-500" },
  { label: "AI Process", icon: Bot, href: "/ai", color: "text-indigo-500" },
  { label: "Scheduler", icon: CalendarClock, href: "/scheduler", color: "text-yellow-500" },
  { label: "Logs", icon: ScrollText, href: "/logs", color: "text-gray-500" },
  { label: "Settings", icon: Settings, href: "/settings", color: "text-zinc-400" },
];

export function Sidebar() {
  const pathname = usePathname();
  
  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white w-64 border-r border-slate-800">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            AutoGravity AI
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(componentsDir, 'layout', 'sidebar.tsx'), sidebar);

// Navbar
const navbar = `"use client";

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
`;
fs.writeFileSync(path.join(componentsDir, 'layout', 'navbar.tsx'), navbar);

// Layout
const layout = `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AutoGravity AI',
  description: 'Automated video upload platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={\`\${inter.className} min-h-screen bg-background antialiased\`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/20">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
`;
fs.writeFileSync(path.join(appDir, 'layout.tsx'), layout);

// Pages
const pages = ['dashboard', 'uploads', 'queue', 'analytics', 'channels', 'ai', 'scheduler', 'logs', 'settings', 'login'];

for (const page of pages) {
  const dir = path.join(appDir, page);
  fs.mkdirSync(dir, { recursive: true });
  const componentName = page.charAt(0).toUpperCase() + page.slice(1) + 'Page';
  const content = `export default function ${componentName}() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold capitalize">${page}</h1>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
}

// Redirect home to dashboard
fs.writeFileSync(path.join(appDir, 'page.tsx'), `import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
`);

console.log('Dashboard UI generated successfully.');
