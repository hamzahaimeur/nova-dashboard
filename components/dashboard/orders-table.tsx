'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Eye,
  MoreHorizontal,
  PackageX,
  RotateCcw,
  Search,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { Order, OrderStatus } from '@/lib/orders-data'
import { cn } from '@/lib/utils'

const statusStyles: Record<OrderStatus, string> = {
  paid: 'bg-success/10 text-success',
  pending: 'bg-chart-5/15 text-chart-5',
  refunded: 'bg-chart-2/15 text-chart-2',
  failed: 'bg-destructive/10 text-destructive',
}

type SortKey = 'orderNumber' | 'customer' | 'amount' | 'status' | 'date'
type SortDir = 'asc' | 'desc'
const PAGE_SIZE = 8

const currency = (v: number) =>
  `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
}

function toTime(date: string) {
  const t = Date.parse(date.replace(' · ', ' '))
  return Number.isNaN(t) ? 0 : t
}

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState(orders)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let result = rows.slice()

    if (q) {
      result = result.filter((o) =>
        [o.orderNumber, o.customer, o.email].some((f) =>
          f.toLowerCase().includes(q),
        ),
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter)
    }

    result.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'date') cmp = toTime(a.date) - toTime(b.date)
      else if (sortKey === 'amount') cmp = a.amount - b.amount
      else cmp = a[sortKey].localeCompare(b[sortKey])
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [rows, query, statusFilter, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = filtered.slice(start, start + PAGE_SIZE)

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'date' || key === 'amount' ? 'desc' : 'asc')
    }
    setPage(1)
  }

  function resetToFirstPage(fn: () => void) {
    fn()
    setPage(1)
  }

  function markPaid(order: Order) {
    setRows((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: 'paid' } : o)),
    )
    toast.success(`${order.orderNumber} marked as paid`)
  }

  function refundOrder(order: Order) {
    setRows((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: 'refunded' } : o)),
    )
    toast.success(`${order.orderNumber} refunded`)
  }

  function cancelOrder(order: Order) {
    setRows((prev) => prev.filter((o) => o.id !== order.id))
    toast.success(`${order.orderNumber} cancelled`)
  }

  const hasFilters = query || statusFilter !== 'all'

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Recent Orders
          </h2>
          <p className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? 'order' : 'orders'}
            {hasFilters ? ' matching filters' : ' this period'}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative sm:w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) =>
                resetToFirstPage(() => setQuery(e.target.value))
              }
              placeholder="Search orders..."
              aria-label="Search orders"
              className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              resetToFirstPage(() =>
                setStatusFilter(e.target.value as OrderStatus | 'all'),
              )
            }
            aria-label="Filter by status"
            className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <option value="all">All statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          hasFilters={!!hasFilters}
          onClear={() => {
            setQuery('')
            setStatusFilter('all')
            setPage(1)
          }}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <SortableTh
                    label="Order"
                    active={sortKey === 'orderNumber'}
                    dir={sortDir}
                    onClick={() => handleSort('orderNumber')}
                  />
                  <SortableTh
                    label="Customer"
                    active={sortKey === 'customer'}
                    dir={sortDir}
                    onClick={() => handleSort('customer')}
                  />
                  <SortableTh
                    label="Amount"
                    active={sortKey === 'amount'}
                    dir={sortDir}
                    onClick={() => handleSort('amount')}
                  />
                  <SortableTh
                    label="Status"
                    active={sortKey === 'status'}
                    dir={sortDir}
                    onClick={() => handleSort('status')}
                  />
                  <SortableTh
                    label="Date"
                    active={sortKey === 'date'}
                    dir={sortDir}
                    onClick={() => handleSort('date')}
                  />
                  <th className="px-5 py-3 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-border/60 last:border-0 transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium tabular-nums">{o.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {o.items} {o.items === 1 ? 'item' : 'items'}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {initials(o.customer)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{o.customer}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {o.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold tabular-nums">
                      {currency(o.amount)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground tabular-nums">
                      {o.date}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <RowActions
                        order={o}
                        onMarkPaid={() => markPaid(o)}
                        onRefund={() => refundOrder(o)}
                        onCancel={() => cancelOrder(o)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <ul className="divide-y divide-border/60 md:hidden">
            {pageRows.map((o) => (
              <li key={o.id} className="flex items-center gap-3 px-4 py-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {initials(o.customer)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">
                      {o.orderNumber}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      · {o.customer}
                    </span>
                  </div>
                  <p className="mt-1.5">
                    <StatusBadge status={o.status} />
                  </p>
                  <p className="mt-1 truncate text-[11px] text-muted-foreground">
                    {o.date}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-sm font-semibold tabular-nums">
                    {currency(o.amount)}
                  </span>
                  <RowActions
                    order={o}
                    onMarkPaid={() => markPaid(o)}
                    onRefund={() => refundOrder(o)}
                    onCancel={() => cancelOrder(o)}
                  />
                </div>
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

function StatusBadge({ status }: { status: OrderStatus }) {
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

function RowActions({
  order,
  onMarkPaid,
  onRefund,
  onCancel,
}: {
  order: Order
  onMarkPaid: () => void
  onRefund: () => void
  onCancel: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Actions for ${order.orderNumber}`}
        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <MoreHorizontal className="size-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] z-20 w-48 origin-top-right overflow-hidden rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg"
        >
          <MenuItem
            icon={Eye}
            label="View details"
            onClick={() => {
              toast.success(`Viewing ${order.orderNumber}`)
              setOpen(false)
            }}
          />
          {order.status !== 'paid' && (
            <MenuItem
              icon={CheckCircle2}
              label="Mark as paid"
              onClick={() => {
                onMarkPaid()
                setOpen(false)
              }}
            />
          )}
          {order.status !== 'refunded' && (
            <MenuItem
              icon={RotateCcw}
              label="Refund order"
              onClick={() => {
                onRefund()
                setOpen(false)
              }}
            />
          )}
          <div className="my-1 h-px bg-border" />
          <MenuItem
            icon={Ban}
            label="Cancel order"
            destructive
            onClick={() => {
              onCancel()
              setOpen(false)
            }}
          />
        </div>
      )}
    </div>
  )
}

function MenuItem({
  icon: Icon,
  label,
  destructive,
  onClick,
}: {
  icon: typeof Eye
  label: string
  destructive?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
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

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean
  onClear: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <PackageX className="size-6" />
      </span>
      <h3 className="mt-4 text-sm font-semibold">No orders found</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground text-pretty">
        {hasFilters
          ? 'No orders match your search or filters. Try adjusting them.'
          : 'There are no orders to display yet.'}
      </p>
      {hasFilters && (
        <Button variant="outline" size="sm" onClick={onClear} className="mt-4">
          Clear filters
        </Button>
      )}
    </div>
  )
}
