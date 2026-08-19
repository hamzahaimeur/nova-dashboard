'use client'

import { motion } from 'framer-motion'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { SourceStat } from '@/lib/analytics-data'

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
]

type TooltipProps = {
  active?: boolean
  payload?: Array<{ value: number; payload: SourceStat }>
}

function ChartTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-popover-foreground shadow-lg">
      <p className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{item.source}</span>
        <span className="ml-auto font-semibold tabular-nums">
          {item.value}%
        </span>
      </p>
    </div>
  )
}

export function SourceChart({ data }: { data: SourceStat[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
      className="rounded-xl border border-border bg-card p-5 shadow-sm"
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold tracking-tight">
          Traffic Sources
        </h2>
        <p className="text-sm text-muted-foreground">Where visits come from</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="source"
                innerRadius={44}
                outerRadius={68}
                paddingAngle={3}
                stroke="none"
                isAnimationActive
                animationDuration={800}
                animationEasing="ease-out"
              >
                {data.map((entry, i) => (
                  <Cell key={entry.source} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="flex-1 space-y-2.5">
          {data.map((entry, i) => (
            <li key={entry.source} className="flex items-center gap-2 text-sm">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="truncate text-muted-foreground">
                {entry.source}
              </span>
              <span className="ml-auto font-medium tabular-nums">
                {entry.value}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
