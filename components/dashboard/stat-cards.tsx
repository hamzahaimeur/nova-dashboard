import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { Stat } from '@/lib/dashboard-data'
import { cn } from '@/lib/utils'

export function StatCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, i) => {
        const positive = stat.change >= 0
        return (
          <div
            key={stat.id}
            className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-border bg-card p-5 shadow-sm transition-colors duration-300 hover:border-primary/40"
            style={{ animationDelay: `${i * 70}ms`, animationFillMode: 'both' }}
          >
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stat.icon className="size-5" />
              </span>
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
                  positive
                    ? 'bg-success/10 text-success'
                    : 'bg-destructive/10 text-destructive',
                )}
              >
                {positive ? (
                  <ArrowUpRight className="size-3.5" />
                ) : (
                  <ArrowDownRight className="size-3.5" />
                )}
                {Math.abs(stat.change)}%
              </span>
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-tight tabular-nums">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}
