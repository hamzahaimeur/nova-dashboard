'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { navItems } from '@/lib/nav-items'
import { useDashboardData } from '@/lib/use-dashboard-data'
import { cn } from '@/lib/utils'
import { ActivityTable } from './activity-table'
import { AnalyticsView } from './analytics-view'
import {
  ChartSkeleton,
  ErrorState,
  StatCardsSkeleton,
  TableSkeleton,
} from './feedback'
import { MobileNav } from './mobile-nav'
import { RevenueChart } from './revenue-chart'
import { Sidebar } from './sidebar'
import { StatCards } from './stat-cards'
import { Topbar } from './topbar'
import { UsersPage } from './users-page'
import { OrdersPage } from './orders-page'
import { SettingsPage } from './settings-page'

export function DashboardShell() {
  const [collapsed, setCollapsed] = useState(false)
  const [active, setActive] = useState('dashboard')
  const { status, data, refreshing, retry, refresh } = useDashboardData()

  const activeLabel =
    navItems.find((item) => item.id === active)?.label ?? 'Dashboard'

  const loading = status === 'loading'
  const error = status === 'error'

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
        active={active}
        onSelect={setActive}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          {active === 'analytics' ? (
            <AnalyticsView />
          ) : active === 'users' ? (
            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
              <UsersPage />
            </div>
          ) : active === 'orders' ? (
            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
              <OrdersPage />
            </div>
          ) : active === 'settings' ? (
            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
              <SettingsPage />
            </div>
          ) : (
            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                    {activeLabel}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back, Hamza. Here&apos;s what&apos;s happening today.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refresh}
                  disabled={loading || refreshing}
                >
                  <RefreshCw
                    className={cn('size-4', refreshing && 'animate-spin')}
                  />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>

              {/* Stat cards */}
              {loading ? (
                <StatCardsSkeleton />
              ) : error ? (
                <ErrorState
                  title="Couldn't load metrics"
                  description="We hit a snag fetching your dashboard metrics."
                  onRetry={retry}
                />
              ) : (
                data && <StatCards stats={data.stats} />
              )}

              {/* Chart + summary */}
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2">
                  {loading ? (
                    <ChartSkeleton />
                  ) : error ? (
                    <ErrorState onRetry={retry} className="h-full" />
                  ) : (
                    data && <RevenueChart data={data.revenue} />
                  )}
                </div>
                <div className="xl:col-span-1">
                  <QuickSummary loading={loading || error} />
                </div>
              </div>

              {/* Activity table */}
              {loading ? (
                <TableSkeleton />
              ) : error ? (
                <ErrorState
                  title="Couldn't load activity"
                  description="We couldn't fetch recent activity. Please try again."
                  onRetry={retry}
                />
              ) : (
                data && <ActivityTable activities={data.activities} />
              )}
            </div>
          )}
        </main>
      </div>

      <MobileNav active={active} onSelect={setActive} />
    </div>
  )
}

function QuickSummary({ loading }: { loading: boolean }) {
  const items = [
    { label: 'Avg. Order Value', value: '$99.90', bar: 72 },
    { label: 'Customer Retention', value: '87%', bar: 87 },
    { label: 'Support Tickets', value: '24 open', bar: 34 },
    { label: 'Uptime', value: '99.98%', bar: 99 },
  ]
  return (
    <div className="h-full rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold tracking-tight">This Month</h2>
      <p className="text-sm text-muted-foreground">Key performance metrics</p>
      <ul className="mt-6 space-y-5">
        {items.map((item) => (
          <li key={item.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-semibold tabular-nums">
                {loading ? '—' : item.value}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                style={{ width: loading ? '0%' : `${item.bar}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
