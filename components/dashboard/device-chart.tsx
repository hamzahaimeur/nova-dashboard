'use client'

import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DeviceStat } from '@/lib/analytics-data'

type TooltipProps = {
  active?: boolean
  payload?: Array<{ value: number; payload: DeviceStat }>
}

function ChartTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-popover-foreground shadow-lg">
      <p className="flex items-center gap-2 text-sm">
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: 'var(--chart-1)' }}
        />
        <span className="text-muted-foreground">{item.device}</span>
        <span className="ml-auto font-semibold tabular-nums">
          {item.value}%
        </span>
      </p>
    </div>
  )
}

export function DeviceChart({ data }: { data: DeviceStat[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
      className="rounded-xl border border-border bg-card p-5 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-base font-semibold tracking-tight">
          Traffic by Device
        </h2>
        <p className="text-sm text-muted-foreground">Share of total visits</p>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="device"
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
              width={36}
              stroke="var(--muted-foreground)"
              fontSize={12}
              domain={[0, 'dataMax + 10']}
              tickCount={5}
              allowDecimals={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
            />
            <Bar
              dataKey="value"
              fill="var(--chart-1)"
              radius={[6, 6, 0, 0]}
              isAnimationActive
              animationDuration={800}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
