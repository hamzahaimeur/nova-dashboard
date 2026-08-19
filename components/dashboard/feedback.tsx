import { AlertTriangle, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-md bg-muted', className)} />
  )
}

export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="size-10 rounded-lg" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-8 w-32" />
          <Skeleton className="mt-2 h-4 w-24" />
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex h-72 items-end gap-3">
        {[52, 64, 48, 72, 58, 80, 68, 90].map((h, i) => (
          <div
            key={i}
            className="flex-1 animate-pulse rounded-md bg-muted"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export function BarChartSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="flex h-56 items-end gap-4 px-2">
        {[62, 31, 7].map((h, i) => (
          <div
            key={i}
            className="flex-1 animate-pulse rounded-md bg-muted"
            style={{ height: `${Math.max(h, 12)}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export function DonutChartSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="flex items-center gap-6">
        <Skeleton className="size-40 shrink-0 rounded-full" />
        <div className="flex-1 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-2 h-4 w-56" />
      </div>
      <div className="space-y-4 p-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ErrorState({
  title = 'Failed to load data',
  description = 'Something went wrong while fetching. Please try again.',
  onRetry,
  className,
}: {
  title?: string
  description?: string
  onRetry: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-border bg-card p-10 text-center shadow-sm',
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" />
      </span>
      <h3 className="mt-4 text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground text-pretty">
        {description}
      </p>
      <Button onClick={onRetry} className="mt-5" size="sm">
        <RotateCw className="size-4" />
        Retry
      </Button>
    </div>
  )
}
