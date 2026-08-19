'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Mail,
  MoreHorizontal,
  Search,
  Shield,
  ShieldOff,
  Trash2,
  UserX,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { AppUser, UserRole, UserStatus } from '@/lib/users-data'
import { cn } from '@/lib/utils'

const statusStyles: Record<UserStatus, string> = {
  active: 'bg-success/10 text-success',
  invited: 'bg-chart-5/15 text-chart-5',
  suspended: 'bg-destructive/10 text-destructive',
}

const roleStyles: Record<UserRole, string> = {
  Admin: 'bg-primary/10 text-primary',
  Editor: 'bg-chart-2/15 text-chart-2',
  Member: 'bg-muted text-foreground',
  Viewer: 'bg-muted text-muted-foreground',
}

type SortKey = 'name' | 'role' | 'status' | 'lastActive'
type SortDir = 'asc' | 'desc'
const PAGE_SIZE = 8

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
}

function toTime(date: string) {
  if (date === 'Never') return 0
  const t = Date.parse(date.replace(' · ', ' '))
  return Number.isNaN(t) ? 0 : t
}

export function UsersTable({ users }: { users: AppUser[] }) {
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('lastActive')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState(users)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let result = rows.slice()

    if (q) {
      result = result.filter((u) =>
        [u.name, u.email, u.team].some((f) => f.toLowerCase().includes(q)),
      )
    }
    if (roleFilter !== 'all') {
      result = result.filter((u) => u.role === roleFilter)
    }
    if (statusFilter !== 'all') {
      result = result.filter((u) => u.status === statusFilter)
    }

    result.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'lastActive') cmp = toTime(a.lastActive) - toTime(b.lastActive)
      else cmp = a[sortKey].localeCompare(b[sortKey])
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [rows, query, roleFilter, statusFilter, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = filtered.slice(start, start + PAGE_SIZE)

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  function resetToFirstPage(fn: () => void) {
    fn()
    setPage(1)
  }

  function toggleSuspend(user: AppUser) {
    setRows((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' }
          : u,
      ),
    )
    toast.success(
      user.status === 'suspended'
        ? `${user.name} reactivated`
        : `${user.name} suspended`,
    )
  }

  function removeUser(user: AppUser) {
    setRows((prev) => prev.filter((u) => u.id !== user.id))
    toast.success(`${user.name} removed`)
  }

  const hasFilters = query || roleFilter !== 'all' || statusFilter !== 'all'

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Team Members
          </h2>
          <p className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? 'user' : 'users'}
            {hasFilters ? ' matching filters' : ' in your workspace'}
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
              placeholder="Search users..."
              aria-label="Search users"
              className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) =>
              resetToFirstPage(() =>
                setRoleFilter(e.target.value as UserRole | 'all'),
              )
            }
            aria-label="Filter by role"
            className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <option value="all">All roles</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Member">Member</option>
            <option value="Viewer">Viewer</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) =>
              resetToFirstPage(() =>
                setStatusFilter(e.target.value as UserStatus | 'all'),
              )
            }
            aria-label="Filter by status"
            className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="invited">Invited</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          hasFilters={!!hasFilters}
          onClear={() => {
            setQuery('')
            setRoleFilter('all')
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
                    label="Name"
                    active={sortKey === 'name'}
                    dir={sortDir}
                    onClick={() => handleSort('name')}
                  />
                  <th className="px-5 py-3 font-medium">Team</th>
                  <SortableTh
                    label="Role"
                    active={sortKey === 'role'}
                    dir={sortDir}
                    onClick={() => handleSort('role')}
                  />
                  <SortableTh
                    label="Status"
                    active={sortKey === 'status'}
                    dir={sortDir}
                    onClick={() => handleSort('status')}
                  />
                  <SortableTh
                    label="Last Active"
                    active={sortKey === 'lastActive'}
                    dir={sortDir}
                    onClick={() => handleSort('lastActive')}
                  />
                  <th className="px-5 py-3 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-border/60 last:border-0 transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {initials(u.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{u.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {u.team}
                    </td>
                    <td className="px-5 py-3.5">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground tabular-nums">
                      {u.lastActive}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <RowActions
                        user={u}
                        onSuspendToggle={() => toggleSuspend(u)}
                        onRemove={() => removeUser(u)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <ul className="divide-y divide-border/60 md:hidden">
            {pageRows.map((u) => (
              <li key={u.id} className="flex items-center gap-3 px-4 py-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {initials(u.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{u.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {u.email}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <RoleBadge role={u.role} />
                    <StatusBadge status={u.status} />
                  </div>
                </div>
                <RowActions
                  user={u}
                  onSuspendToggle={() => toggleSuspend(u)}
                  onRemove={() => removeUser(u)}
                />
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

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        roleStyles[role],
      )}
    >
      {role}
    </span>
  )
}

function StatusBadge({ status }: { status: UserStatus }) {
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
  user,
  onSuspendToggle,
  onRemove,
}: {
  user: AppUser
  onSuspendToggle: () => void
  onRemove: () => void
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
        aria-label={`Actions for ${user.name}`}
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
            icon={Mail}
            label="Email user"
            onClick={() => {
              toast.success(`Email sent to ${user.name}`)
              setOpen(false)
            }}
          />
          <MenuItem
            icon={user.status === 'suspended' ? Shield : ShieldOff}
            label={user.status === 'suspended' ? 'Reactivate' : 'Suspend'}
            onClick={() => {
              onSuspendToggle()
              setOpen(false)
            }}
          />
          <div className="my-1 h-px bg-border" />
          <MenuItem
            icon={Trash2}
            label="Remove user"
            destructive
            onClick={() => {
              onRemove()
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
  icon: typeof Mail
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
        <UserX className="size-6" />
      </span>
      <h3 className="mt-4 text-sm font-semibold">No users found</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground text-pretty">
        {hasFilters
          ? 'No users match your search or filters. Try adjusting them.'
          : 'There are no users in this workspace yet.'}
      </p>
      {hasFilters && (
        <Button variant="outline" size="sm" onClick={onClear} className="mt-4">
          Clear filters
        </Button>
      )}
    </div>
  )
}
