'use client'

import { navItems } from '@/lib/nav-items'
import { cn } from '@/lib/utils'

type MobileNavProps = {
  active: string
  onSelect: (id: string) => void
}

export function MobileNav({ active, onSelect }: MobileNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md md:hidden">
      <ul className="flex items-stretch justify-around px-1 py-1.5">
        {navItems.map((item) => {
          const isActive = active === item.id
          return (
            <li key={item.id} className="flex-1">
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={cn(
                  'flex w-full flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[11px] font-medium transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="size-5" />
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
