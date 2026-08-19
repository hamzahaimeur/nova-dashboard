import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

export type Stat = {
  id: string
  label: string
  value: string
  change: number
  icon: LucideIcon
}

export const stats: Stat[] = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: '$284,392',
    change: 12.4,
    icon: DollarSign,
  },
  {
    id: 'users',
    label: 'Active Users',
    value: '18,472',
    change: 8.1,
    icon: Users,
  },
  {
    id: 'orders',
    label: 'New Orders',
    value: '2,845',
    change: -3.2,
    icon: ShoppingCart,
  },
  {
    id: 'conversion',
    label: 'Conversion Rate',
    value: '4.87%',
    change: 1.9,
    icon: TrendingUp,
  },
]

export type RevenuePoint = { month: string; revenue: number; target: number }

export const revenueData: RevenuePoint[] = [
  { month: 'Jan', revenue: 38200, target: 35000 },
  { month: 'Feb', revenue: 41500, target: 38000 },
  { month: 'Mar', revenue: 46800, target: 42000 },
  { month: 'Apr', revenue: 43900, target: 45000 },
  { month: 'May', revenue: 52400, target: 48000 },
  { month: 'Jun', revenue: 61300, target: 52000 },
]

export type ActivityStatus = 'completed' | 'pending' | 'failed'

export type Activity = {
  id: string
  user: string
  email: string
  action: string
  date: string
  status: ActivityStatus
}

export const activities: Activity[] = [
  {
    id: '1',
    user: 'Hamza',
    email: 'hamza@daralhikma.ma',
    action: 'Upgraded to Pro plan',
    date: 'Aug 15, 2026 · 2:41 PM',
    status: 'completed',
  },
  {
    id: '2',
    user: 'Omar',
    email: 'omar@amanah.ma',
    action: 'Created new project',
    date: 'Aug 15, 2026 · 1:12 PM',
    status: 'completed',
  },
  {
    id: '3',
    user: 'Khalid',
    email: 'khalid@safaa.ma',
    action: 'Requested a refund',
    date: 'Aug 14, 2026 · 6:58 PM',
    status: 'pending',
  },
  {
    id: '4',
    user: 'Youssef',
    email: 'youssef@baraka.ma',
    action: 'Payment failed',
    date: 'Aug 14, 2026 · 4:03 PM',
    status: 'failed',
  },
  {
    id: '5',
    user: 'Ibrahim',
    email: 'ibrahim@tayyib.ma',
    action: 'Invited 3 team members',
    date: 'Aug 14, 2026 · 11:27 AM',
    status: 'completed',
  },
  {
    id: '6',
    user: 'Mohammed',
    email: 'mohammed@noor.ma',
    action: 'Subscription renewed',
    date: 'Aug 13, 2026 · 9:15 AM',
    status: 'pending',
  },
  {
    id: '7',
    user: 'Salem',
    email: 'salem@ihsan.ma',
    action: 'Exported analytics report',
    date: 'Aug 13, 2026 · 8:02 AM',
    status: 'completed',
  },
  {
    id: '8',
    user: 'Faisal',
    email: 'faisal@sidq.ma',
    action: 'Payment failed',
    date: 'Aug 12, 2026 · 5:44 PM',
    status: 'failed',
  },
  {
    id: '9',
    user: 'Tariq',
    email: 'tariq@rayyan.ma',
    action: 'Updated billing details',
    date: 'Aug 12, 2026 · 3:19 PM',
    status: 'completed',
  },
  {
    id: '10',
    user: 'Yassir',
    email: 'yassir@rahma.ma',
    action: 'Requested a refund',
    date: 'Aug 12, 2026 · 10:51 AM',
    status: 'pending',
  },
  {
    id: '11',
    user: 'Abdullah',
    email: 'abdullah@salam.ma',
    action: 'Upgraded to Pro plan',
    date: 'Aug 11, 2026 · 7:33 PM',
    status: 'completed',
  },
  {
    id: '12',
    user: 'Ahmed',
    email: 'ahmed@fajr.ma',
    action: 'Deleted a workspace',
    date: 'Aug 11, 2026 · 2:08 PM',
    status: 'failed',
  },
  {
    id: '13',
    user: 'Bilal',
    email: 'bilal@najah.ma',
    action: 'Created new project',
    date: 'Aug 11, 2026 · 9:47 AM',
    status: 'completed',
  },
  {
    id: '14',
    user: 'Anas',
    email: 'anas@huda.ma',
    action: 'Invited 5 team members',
    date: 'Aug 10, 2026 · 4:22 PM',
    status: 'pending',
  },
]

export type DashboardData = {
  stats: Stat[]
  revenue: RevenuePoint[]
  activities: Activity[]
}

/**
 * Simulates an async data fetch. Resolves after a short delay, or rejects
 * when `forceError` is set (used to demonstrate the error/retry UI, e.g.
 * by visiting the page with `?error` in the URL).
 */
export function fetchDashboardData(
  { forceError = false, delay = 1100 }: { forceError?: boolean; delay?: number } = {},
): Promise<DashboardData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (forceError) {
        reject(new Error('Failed to load dashboard data'))
        return
      }
      resolve({ stats, revenue: revenueData, activities })
    }, delay)
  })
}
