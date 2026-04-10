"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Sidebar } from "@/components/layout/sidebar"
import { useState } from "react"

interface MobileNavProps {
  user?: {
    name?: string | null
    email?: string | null
  }
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Menu className="size-5" />
        <span className="sr-only">Menu</span>
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-[85vw] max-w-xs border-r p-0 sm:w-72"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Menu de navegação</SheetTitle>
          </SheetHeader>
          <Sidebar user={user} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
