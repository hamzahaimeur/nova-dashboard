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
import type { TopPage } from '@/lib/analytics-data'
import { cn } from '@/lib/utils'

type SortKey = 'url' | 'views' | 'avgTime' | 'bounceRate'
type SortDir = 'asc' | 'desc'
const PAGE_SIZE = 5

// Parse "4m 32s" into total seconds for sorting.
function toSeconds(time: string) {
  const match = time.match(/(\d+)m\s*(\d+)s/)
  if (!match) return 0
  return Number(match[1]) * 60 + Number(match[2])
}

export function TopPagesTable({ pages }: { pages: TopPage[] }) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('views')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = q
      ? pages.filter((p) => p.url.toLowerCase().includes(q))
      : pages.slice()

    rows.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'url') cmp = a.url.localeCompare(b.url)
      else if (sortKey === 'avgTime') cmp = toSeconds(a.avgTime) - toSeconds(b.avgTime)
      else cmp = a[sortKey] - b[sortKey]
      return sortDir === 'asc' ? cmp : -cmp
    })
    return rows
  }, [pages, query, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = filtered.slice(start, start + PAGE_SIZE)

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'url' ? 'asc' : 'desc')
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
            Top Pages
          </h2>
          <p className="text-sm text-muted-foreground">
            Most visited pages this period
          </p>
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search pages..."
            aria-label="Search pages"
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
                    label="Page URL"
                    active={sortKey === 'url'}
                    dir={sortDir}
                    onClick={() => handleSort('url')}
                  />
                  <SortableTh
                    label="Views"
                    align="right"
                    active={sortKey === 'views'}
                    dir={sortDir}
                    onClick={() => handleSort('views')}
                  />
                  <SortableTh
                    label="Avg. Time"
                    align="right"
                    active={sortKey === 'avgTime'}
                    dir={sortDir}
                    onClick={() => handleSort('avgTime')}
                  />
                  <SortableTh
                    label="Bounce Rate"
                    align="right"
                    active={sortKey === 'bounceRate'}
                    dir={sortDir}
                    onClick={() => handleSort('bounceRate')}
                  />
                </tr>
              </thead>
              <tbody>
                {pageRows.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border/60 last:border-0 transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-medium">{p.url}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-muted-foreground tabular-nums">
                      {p.views.toLocaleString('en-US')}
                    </td>
                    <td className="px-5 py-3.5 text-right text-muted-foreground tabular-nums">
                      {p.avgTime}
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums">
                      <BounceBadge value={p.bounceRate} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <ul className="divide-y divide-border/60 sm:hidden">
            {pageRows.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-4 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.url}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {p.views.toLocaleString('en-US')} views · {p.avgTime}
                  </p>
                </div>
                <BounceBadge value={p.bounceRate} />
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
      <h3 className="mt-4 text-sm font-semibold">No pages found</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground text-pretty">
        {query
          ? `No results match "${query}". Try a different search term.`
          : 'There are no pages to display yet.'}
      </p>
      {query && (
        <Button variant="outline" size="sm" onClick={onClear} className="mt-4">
          Clear search
        </Button>
      )}
    </div>
  )
}

function BounceBadge({ value }: { value: number }) {
  const tone =
    value < 30
      ? 'bg-success/10 text-success'
      : value < 45
        ? 'bg-chart-5/15 text-chart-5'
        : 'bg-destructive/10 text-destructive'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        tone,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {value}%
    </span>
  )
}
