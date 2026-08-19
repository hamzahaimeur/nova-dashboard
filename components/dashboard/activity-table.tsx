'use client'

import { useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Search,
  SearchX,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Activity, ActivityStatus } from '@/lib/dashboard-data'
import { cn } from '@/lib/utils'

const statusStyles: Record<ActivityStatus, string> = {
  completed: 'bg-success/10 text-success',
  pending: 'bg-chart-5/15 text-chart-5',
  failed: 'bg-destructive/10 text-destructive',
}

type SortKey = 'user' | 'action' | 'date' | 'status'
type SortDir = 'asc' | 'desc'
const PAGE_SIZE = 5

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
}

// Parse "Aug 15, 2026 · 2:41 PM" into a sortable timestamp.
function toTime(date: string) {
  const t = Date.parse(date.replace(' · ', ' '))
  return Number.isNaN(t) ? 0 : t
}

export function ActivityTable({ activities }: { activities: Activity[] }) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = q
      ? activities.filter((a) =>
          [a.user, a.email, a.action, a.status].some((f) =>
            f.toLowerCase().includes(q),
          ),
        )
      : activities.slice()

    rows.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'date') cmp = toTime(a.date) - toTime(b.date)
      else cmp = a[sortKey].localeCompare(b[sortKey])
      return sortDir === 'asc' ? cmp : -cmp
    })
    return rows
  }, [activities, query, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = filtered.slice(start, start + PAGE_SIZE)

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'date' ? 'desc' : 'asc')
    }
    setPage(1)
  }

  function handleSearch(value: string) {
    setQuery(value)
    setPage(1)
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Recent Activity
          </h2>
          <p className="text-sm text-muted-foreground">
            Latest actions across your workspace
          </p>
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search activity..."
            aria-label="Search activity"
            className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState query={query} onClear={() => handleSearch('')} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <SortableTh
                    label="User"
                    active={sortKey === 'user'}
                    dir={sortDir}
                    onClick={() => handleSort('user')}
                  />
                  <SortableTh
                    label="Action"
                    active={sortKey === 'action'}
                    dir={sortDir}
                    onClick={() => handleSort('action')}
                  />
                  <SortableTh
                    label="Date"
                    active={sortKey === 'date'}
                    dir={sortDir}
                    onClick={() => handleSort('date')}
                  />
                  <SortableTh
                    label="Status"
                    align="right"
                    active={sortKey === 'status'}
                    dir={sortDir}
                    onClick={() => handleSort('status')}
                  />
                </tr>
              </thead>
              <tbody>
                {pageRows.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-border/60 last:border-0 transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {initials(a.user)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{a.user}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {a.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {a.action}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground tabular-nums">
                      {a.date}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <StatusBadge status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <ul className="divide-y divide-border/60 sm:hidden">
            {pageRows.map((a) => (
              <li key={a.id} className="flex items-center gap-3 px-4 py-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {initials(a.user)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.user}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.action}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {a.date}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-5 py-3 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              Showing{' '}
              <span className="font-medium text-foreground">
                {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)}
              </span>{' '}
              of{' '}
              <span className="font-medium text-foreground">
                {filtered.length}
              </span>
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
                Prev
              </Button>
              <span className="px-2 text-xs tabular-nums text-muted-foreground">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function SortableTh({
  label,
  active,
  dir,
  align = 'left',
  onClick,
}: {
  label: string
  active: boolean
  dir: SortDir
  align?: 'left' | 'right'
  onClick: () => void
}) {
  return (
    <th className={cn('px-5 py-3 font-medium', align === 'right' && 'text-right')}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'inline-flex items-center gap-1 uppercase tracking-wide transition-colors hover:text-foreground',
          align === 'right' && 'flex-row-reverse',
          active && 'text-foreground',
        )}
      >
        {label}
        {active ? (
          dir === 'asc' ? (
            <ChevronUp className="size-3.5" />
          ) : (
            <ChevronDown className="size-3.5" />
          )
        ) : (
          <ChevronsUpDown className="size-3.5 opacity-50" />
        )}
      </button>
    </th>
  )
}

function EmptyState({
  query,
  onClear,
}: {
  query: string
  onClear: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-6" />
      </span>
      <h3 className="mt-4 text-sm font-semibold">No activity found</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground text-pretty">
        {query
          ? `No results match "${query}". Try a different search term.`
          : 'There is no recent activity to display yet.'}
      </p>
      {query && (
        <Button variant="outline" size="sm" onClick={onClear} className="mt-4">
          Clear search
        </Button>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: ActivityStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize',
        statusStyles[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
