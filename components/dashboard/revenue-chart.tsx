'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { RevenuePoint } from '@/lib/dashboard-data'

const currency = (v: number) =>
  `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`

type TooltipProps = {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string }>
  label?: string
}

function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-popover-foreground shadow-lg">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} className="flex items-center gap-2 text-sm">
          <span
            className="size-2 rounded-full"
            style={{
              backgroundColor:
                item.dataKey === 'revenue'
                  ? 'var(--chart-1)'
                  : 'var(--muted-foreground)',
            }}
          />
          <span className="capitalize text-muted-foreground">
            {item.dataKey}
          </span>
          <span className="ml-auto font-semibold tabular-nums">
            {currency(item.value)}
          </span>
        </p>
      ))}
    </div>
  )
}

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <div className="animate-in fade-in duration-500 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Revenue Overview
          </h2>
          <p className="text-sm text-muted-foreground">Last 6 months</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="size-2.5 rounded-full bg-chart-1" />
            Revenue
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="size-2.5 rounded-full bg-muted-foreground" />
            Target
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                <stop
                  offset="100%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              stroke="var(--muted-foreground)"
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={48}
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke="var(--muted-foreground)"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              fill="none"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--chart-1)"
              strokeWidth={2.5}
              fill="url(#revFill)"
              dot={{ r: 3, fill: 'var(--chart-1)', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: 'var(--chart-1)', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
