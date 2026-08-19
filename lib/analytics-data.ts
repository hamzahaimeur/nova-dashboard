import { Eye, MousePointerClick, Clock, Repeat, type LucideIcon } from 'lucide-react'
import type { Stat } from './dashboard-data'

export const analyticsStats: Stat[] = [
  {
    id: 'pageviews',
    label: 'Page Views',
    value: '1.28M',
    change: 9.4,
    icon: Eye,
  },
  {
    id: 'bounce',
    label: 'Bounce Rate',
    value: '38.2%',
    change: -4.1,
    icon: MousePointerClick,
  },
  {
    id: 'session',
    label: 'Avg. Session Duration',
    value: '4m 32s',
    change: 2.3,
    icon: Clock,
  },
  {
    id: 'newret',
    label: 'New vs Returning',
    value: '42% New',
    change: -1.8,
    icon: Repeat,
  },
]

export type TrafficPoint = { month: string; visits: number }

export const trafficData: TrafficPoint[] = [
  { month: 'Jan', visits: 68200 },
  { month: 'Feb', visits: 72500 },
  { month: 'Mar', visits: 81300 },
  { month: 'Apr', visits: 76900 },
  { month: 'May', visits: 89400 },
  { month: 'Jun', visits: 97800 },
  { month: 'Jul', visits: 94100 },
  { month: 'Aug', visits: 105600 },
  { month: 'Sep', visits: 112300 },
  { month: 'Oct', visits: 108700 },
  { month: 'Nov', visits: 121900 },
  { month: 'Dec', visits: 134500 },
]

export type DeviceStat = { device: string; value: number }

export const deviceData: DeviceStat[] = [
  { device: 'Desktop', value: 62 },
  { device: 'Mobile', value: 31 },
  { device: 'Tablet', value: 7 },
]

export type SourceStat = { source: string; value: number }

export const sourceData: SourceStat[] = [
  { source: 'Organic Search', value: 40 },
  { source: 'Direct', value: 35 },
  { source: 'Social', value: 15 },
  { source: 'Referral', value: 10 },
]

export type TopPage = {
  id: string
  url: string
  views: number
  avgTime: string
  bounceRate: number
}

export const topPages: TopPage[] = [
  { id: '1', url: '/', views: 284392, avgTime: '2m 14s', bounceRate: 32.1 },
  { id: '2', url: '/pricing', views: 152847, avgTime: '3m 02s', bounceRate: 28.4 },
  { id: '3', url: '/blog/getting-started', views: 98213, avgTime: '4m 41s', bounceRate: 22.7 },
  { id: '4', url: '/features', views: 87650, avgTime: '2m 38s', bounceRate: 35.9 },
  { id: '5', url: '/docs/api', views: 76432, avgTime: '5m 12s', bounceRate: 19.3 },
  { id: '6', url: '/blog/react-19-guide', views: 64921, avgTime: '4m 05s', bounceRate: 24.8 },
  { id: '7', url: '/templates', views: 58304, avgTime: '3m 27s', bounceRate: 31.2 },
  { id: '8', url: '/about', views: 41287, avgTime: '1m 48s', bounceRate: 44.6 },
  { id: '9', url: '/contact', views: 33765, avgTime: '1m 22s', bounceRate: 51.3 },
  { id: '10', url: '/blog/dark-mode-css', views: 29841, avgTime: '3m 55s', bounceRate: 26.1 },
  { id: '11', url: '/changelog', views: 21094, avgTime: '2m 03s', bounceRate: 38.7 },
  { id: '12', url: '/careers', views: 14652, avgTime: '2m 51s', bounceRate: 41.5 },
]

export type AnalyticsData = {
  stats: Stat[]
  traffic: TrafficPoint[]
  devices: DeviceStat[]
  sources: SourceStat[]
  pages: TopPage[]
}

/**
 * Simulates an async data fetch, mirroring fetchDashboardData in
 * dashboard-data.ts. Resolves after a short delay, or rejects when
 * `forceError` is set (used to demonstrate the error/retry UI).
 */
export function fetchAnalyticsData(
  { forceError = false, delay = 1100 }: { forceError?: boolean; delay?: number } = {},
): Promise<AnalyticsData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (forceError) {
        reject(new Error('Failed to load analytics data'))
        return
      }
      resolve({
        stats: analyticsStats,
        traffic: trafficData,
        devices: deviceData,
        sources: sourceData,
        pages: topPages,
      })
    }, delay)
  })
}
