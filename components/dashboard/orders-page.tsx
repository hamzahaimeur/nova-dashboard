'use client'

import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useOrdersData } from '@/lib/use-orders-data'
import { ErrorState, StatCardsSkeleton, TableSkeleton } from './feedback'
import { OrdersTable } from './orders-table'
import { StatCards } from './stat-cards'

export function OrdersPage() {
  const { status, data, retry } = useOrdersData()

  const loading = status === 'loading'
  const error = status === 'error'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            Orders
          </h2>
          <p className="text-sm text-muted-foreground">
            Track payments, refunds, and fulfillment
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success('Orders exported to CSV')}
        >
          <Download className="size-4" />
          Export
        </Button>
      </div>

      {loading ? (
        <StatCardsSkeleton />
      ) : error ? (
        <ErrorState
          title="Couldn't load orders"
          description="We hit a snag fetching your recent orders."
          onRetry={retry}
        />
      ) : (
        data && <StatCards stats={data.stats} />
      )}

      {loading ? (
        <TableSkeleton />
      ) : error ? null : (
        data && <OrdersTable orders={data.orders} />
      )}
    </div>
  )
}
