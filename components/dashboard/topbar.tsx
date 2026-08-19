'use client'

import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
  Settings,
  User,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'

export function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Zap className="size-4.5" />
        </div>
      </div>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search anything..."
          aria-label="Search"
          className="h-9 w-full rounded-lg border border-input bg-muted/40 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:bg-background focus:ring-3 focus:ring-ring/30"
        />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          aria-label="Search"
        >
          <Search />
        </Button>

        <ThemeToggle />

        <div className="relative">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell />
          </Button>
          <span className="absolute right-1.5 top-1.5 flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
        </div>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-lg p-1 pr-1.5 transition-colors hover:bg-muted"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-chart-2 text-sm font-semibold text-primary-foreground">
              HH
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-medium">Hamza</span>
              <span className="block text-xs text-muted-foreground">
                Admin
              </span>
            </span>
            <ChevronDown
              className={cn(
                'hidden size-4 text-muted-foreground transition-transform sm:block',
                menuOpen && 'rotate-180',
              )}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+8px)] w-56 origin-top-right overflow-hidden rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg"
            >
              <div className="px-2.5 py-2">
                <p className="text-sm font-medium">Hamza</p>
                <p className="truncate text-xs text-muted-foreground">
                  hamza@daralhikma.ma
                </p>
              </div>
              <div className="my-1 h-px bg-border" />
              <MenuItem icon={User} label="Profile" />
              <MenuItem icon={Settings} label="Settings" />
              <div className="my-1 h-px bg-border" />
              <MenuItem icon={LogOut} label="Logout" destructive />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function MenuItem({
  icon: Icon,
  label,
  destructive,
}: {
  icon: typeof User
  label: string
  destructive?: boolean
}) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
        destructive
          ? 'text-destructive hover:bg-destructive/10'
          : 'text-foreground hover:bg-muted',
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  )
}
