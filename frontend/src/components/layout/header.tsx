import { UserMenu } from "@/components/auth/user-menu"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ThemeToggle } from "@/components/layout/theme-toggle"

interface HeaderProps {
  user?: {
    name?: string | null
    email?: string | null
  }
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center gap-2">
        <MobileNav user={user} />
        <span className="text-lg font-semibold md:hidden">Jera Capital</span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  )
}
