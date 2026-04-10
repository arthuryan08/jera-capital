"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, PlusCircle, History } from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface SidebarProps {
  user?: {
    name?: string | null
    email?: string | null
  }
  onNavigate?: () => void
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/simulations/new", label: "Nova Simulação", icon: PlusCircle },
  { href: "/simulations", label: "Histórico", icon: History },
]

export function Sidebar({ user, onNavigate }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-full flex-col overflow-y-auto bg-card">
      <div className="flex h-14 items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-lg font-bold">Jera Capital</span>
        </Link>
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/simulations"
              ? pathname === "/simulations"
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <Separator />
      <div className="px-4 py-3">
        <p className="truncate text-sm font-medium">
          {user?.name || "Usuário"}
        </p>
        <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
      </div>
    </aside>
  )
}

export { navItems }
