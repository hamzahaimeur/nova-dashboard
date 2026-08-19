import {
  DollarSign,
  PackageCheck,
  RotateCcw,
  ShoppingCart,
  type LucideIcon,
} from 'lucide-react'

export type OrderStatus = 'paid' | 'pending' | 'refunded' | 'failed'

export type Order = {
  id: string
  orderNumber: string
  customer: string
  email: string
  items: number
  amount: number
  status: OrderStatus
  date: string
}

export const orders: Order[] = [
  { id: '1', orderNumber: '#3021', customer: 'Hamza', email: 'hamza@daralhikma.ma', items: 3, amount: 284.0, status: 'paid', date: 'Aug 16, 2026 · 4:12 PM' },
  { id: '2', orderNumber: '#3020', customer: 'Omar', email: 'omar@amanah.ma', items: 1, amount: 59.99, status: 'paid', date: 'Aug 16, 2026 · 2:47 PM' },
  { id: '3', orderNumber: '#3019', customer: 'Khalid', email: 'khalid@safaa.ma', items: 5, amount: 412.5, status: 'pending', date: 'Aug 16, 2026 · 1:05 PM' },
  { id: '4', orderNumber: '#3018', customer: 'Youssef', email: 'youssef@baraka.ma', items: 2, amount: 138.0, status: 'failed', date: 'Aug 15, 2026 · 9:03 PM' },
  { id: '5', orderNumber: '#3017', customer: 'Ibrahim', email: 'ibrahim@tayyib.ma', items: 4, amount: 226.75, status: 'paid', date: 'Aug 15, 2026 · 6:20 PM' },
  { id: '6', orderNumber: '#3016', customer: 'Mohammed', email: 'mohammed@noor.ma', items: 1, amount: 44.0, status: 'refunded', date: 'Aug 15, 2026 · 3:41 PM' },
  { id: '7', orderNumber: '#3015', customer: 'Salem', email: 'salem@ihsan.ma', items: 6, amount: 501.2, status: 'paid', date: 'Aug 15, 2026 · 11:55 AM' },
  { id: '8', orderNumber: '#3014', customer: 'Faisal', email: 'faisal@sidq.ma', items: 2, amount: 96.4, status: 'pending', date: 'Aug 14, 2026 · 8:14 PM' },
  { id: '9', orderNumber: '#3013', customer: 'Tariq', email: 'tariq@rayyan.ma', items: 3, amount: 177.0, status: 'paid', date: 'Aug 14, 2026 · 5:02 PM' },
  { id: '10', orderNumber: '#3012', customer: 'Yassir', email: 'yassir@rahma.ma', items: 1, amount: 29.99, status: 'failed', date: 'Aug 14, 2026 · 1:47 PM' },
  { id: '11', orderNumber: '#3011', customer: 'Abdullah', email: 'abdullah@salam.ma', items: 7, amount: 618.3, status: 'paid', date: 'Aug 13, 2026 · 7:33 PM' },
  { id: '12', orderNumber: '#3010', customer: 'Ahmed', email: 'ahmed@fajr.ma', items: 2, amount: 84.0, status: 'refunded', date: 'Aug 13, 2026 · 2:08 PM' },
  { id: '13', orderNumber: '#3009', customer: 'Bilal', email: 'bilal@najah.ma', items: 4, amount: 312.6, status: 'paid', date: 'Aug 13, 2026 · 9:47 AM' },
  { id: '14', orderNumber: '#3008', customer: 'Anas', email: 'anas@huda.ma', items: 1, amount: 52.5, status: 'pending', date: 'Aug 12, 2026 · 6:22 PM' },
  { id: '15', orderNumber: '#3007', customer: 'Ayoub', email: 'ayoub@karama.ma', items: 3, amount: 199.0, status: 'paid', date: 'Aug 12, 2026 · 12:10 PM' },
  { id: '16', orderNumber: '#3006', customer: 'Hicham', email: 'hicham@hayat.ma', items: 5, amount: 344.2, status: 'paid', date: 'Aug 11, 2026 · 4:26 PM' },
  { id: '17', orderNumber: '#3005', customer: 'Mehdi', email: 'mehdi@safa.ma', items: 2, amount: 118.0, status: 'failed', date: 'Aug 11, 2026 · 8:15 AM' },
  { id: '18', orderNumber: '#3004', customer: 'Zakaria', email: 'zakaria@bayan.ma', items: 1, amount: 39.99, status: 'paid', date: 'Aug 10, 2026 · 5:30 PM' },
  { id: '19', orderNumber: '#3003', customer: 'Ismail', email: 'ismail@amin.ma', items: 3, amount: 210.4, status: 'refunded', date: 'Aug 10, 2026 · 10:02 AM' },
  { id: '20', orderNumber: '#3002', customer: 'Sofiane', email: 'sofiane@khayr.ma', items: 2, amount: 91.0, status: 'paid', date: 'Aug 09, 2026 · 3:19 PM' },
  { id: '21', orderNumber: '#3001', customer: 'Reda', email: 'reda@rizq.ma', items: 4, amount: 268.75, status: 'paid', date: 'Aug 09, 2026 · 9:48 AM' },
  { id: '22', orderNumber: '#3000', customer: 'Nabil', email: 'nabil@mawaddah.ma', items: 1, amount: 64.0, status: 'pending', date: 'Aug 08, 2026 · 1:05 PM' },
]

export type OrderStat = {
  id: string
  label: string
  value: string
  change: number
  icon: LucideIcon
}

export const orderStats: OrderStat[] = [
  { id: 'total', label: 'Total Orders', value: '22', change: 6.8, icon: ShoppingCart },
  { id: 'revenue', label: 'Orders Revenue', value: '$4,522', change: 11.2, icon: DollarSign },
  { id: 'fulfilled', label: 'Fulfilled', value: '15', change: 3.4, icon: PackageCheck },
  { id: 'refunded', label: 'Refunded', value: '3', change: -1.5, icon: RotateCcw },
]

export type OrdersData = {
  stats: OrderStat[]
  orders: Order[]
}

/**
 * Simulates an async data fetch, mirroring fetchDashboardData / fetchUsersData
 * so the Orders page can reuse the same loading / error / retry pattern.
 */
export function fetchOrdersData(
  { forceError = false, delay = 900 }: { forceError?: boolean; delay?: number } = {},
): Promise<OrdersData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (forceError) {
        reject(new Error('Failed to load orders'))
        return
      }
      resolve({ stats: orderStats, orders })
    }, delay)
  })
}
