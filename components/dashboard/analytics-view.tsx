'use client'

import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAnalyticsData } from '@/lib/use-analytics-data'
import { cn } from '@/lib/utils'
import { DeviceChart } from './device-chart'
import {
  BarChartSkeleton,
  ChartSkeleton,
  DonutChartSkeleton,
  ErrorState,
  StatCardsSkeleton,
  TableSkeleton,
} from './feedback'
import { SourceChart } from './source-chart'
import { StatCards } from './stat-cards'
import { TopPagesTable } from './top-pages-table'
import { TrafficChart } from './traffic-chart'

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.07, ease: 'easeOut' as const },
  }),
}

export function AnalyticsView() {
  const { status, data, refreshing, retry, refresh } = useAnalyticsData()

  const loading = status === 'loading'
  const error = status === 'error'

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Traffic, engagement, and page performance for your site.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={loading || refreshing}
        >
          <RefreshCw className={cn('size-4', refreshing && 'animate-spin')} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Stat cards */}
      {loading ? (
        <StatCardsSkeleton />
      ) : error ? (
        <ErrorState
          title="Couldn't load analytics"
          description="We hit a snag fetching your analytics metrics."
          onRetry={retry}
        />
      ) : (
        data && <StatCards stats={data.stats} />
      )}

      {/* Traffic chart */}
      {loading ? (
        <ChartSkeleton />
      ) : error ? (
        <ErrorState onRetry={retry} />
      ) : (
        data && <TrafficChart data={data.traffic} />
      )}

      {/* Device + source charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {loading ? (
          <>
            <BarChartSkeleton />
            <DonutChartSkeleton />
          </>
        ) : error ? (
          <>
            <ErrorState onRetry={retry} />
            <ErrorState onRetry={retry} />
          </>
        ) : (
          data && (
            <>
              <DeviceChart data={data.devices} />
              <SourceChart data={data.sources} />
            </>
          )
        )}
      </div>

      {/* Top pages table */}
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState
          title="Couldn't load top pages"
          description="We couldn't fetch page performance. Please try again."
          onRetry={retry}
        />
      ) : (
        data && (
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <TopPagesTable pages={data.pages} />
          </motion.div>
        )
      )}
    </div>
  )
}
