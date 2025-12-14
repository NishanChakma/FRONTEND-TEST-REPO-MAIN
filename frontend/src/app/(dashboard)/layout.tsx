"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Files,
  Users,
  PieChart,
  Settings,
  Menu,
  X,
  MessageSquare,
  LogOut,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const sidebarItems = [
    { name: "Overview", href: "/", icon: LayoutDashboard, roles: ["ALL"] },
    { name: "Documents", href: "/documents", icon: Files, roles: ["ALL"] },
    {
      name: "My Funds",
      href: "/funds",
      icon: PieChart,
      roles: ["FUND_MANAGER", "ADMIN"],
    },
    { name: "Chat", href: "/chat", icon: MessageSquare, roles: ["ALL"] },
    {
      name: "Users",
      href: "/users",
      icon: Users,
      roles: ["ADMIN", "COMPLIANCE_OFFICER"],
    },
    { name: "Settings", href: "/settings", icon: Settings, roles: ["ALL"] },
  ];

  const filteredItems = sidebarItems.filter(
    (item) => item.roles[0] === "ALL" || item.roles.includes(user.role)
  );

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col fixed h-full z-50 transition-transform duration-300 ease-in-out",
          "md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
          <Link
            href="/"
            className="font-bold text-xl text-blue-600 dark:text-blue-400 flex items-center gap-2"
          >
            <div className="h-8 w-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <Files className="h-5 w-5" />
            </div>
            <span className="hidden sm:inline">AuditVault</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {filteredItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4",
                    isActive
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="h-9 w-9 border border-gray-200 dark:border-gray-700">
              <AvatarImage src="/avatars/01.png" alt={user.name} />
              <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={logout}
            className="w-full justify-start gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-bold text-lg md:hidden dark:text-gray-100">
            AuditVault
          </span>
          <div className="md:ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
