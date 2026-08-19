import {
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users as UsersIcon,
  type LucideIcon,
} from 'lucide-react'

export type UserRole = 'Admin' | 'Editor' | 'Member' | 'Viewer'
export type UserStatus = 'active' | 'invited' | 'suspended'

export type AppUser = {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  team: string
  joined: string
  lastActive: string
}

export const users: AppUser[] = [
  { id: '1', name: 'Hamza', email: 'hamza@daralhikma.ma', role: 'Admin', status: 'active', team: 'Platform', joined: 'Jan 12, 2025', lastActive: 'Aug 16, 2026 · 4:12 PM' },
  { id: '2', name: 'Omar', email: 'omar@amanah.ma', role: 'Editor', status: 'active', team: 'Growth', joined: 'Feb 03, 2025', lastActive: 'Aug 16, 2026 · 2:47 PM' },
  { id: '3', name: 'Khalid', email: 'khalid@safaa.ma', role: 'Member', status: 'invited', team: 'Design', joined: 'Aug 10, 2026', lastActive: 'Never' },
  { id: '4', name: 'Youssef', email: 'youssef@baraka.ma', role: 'Member', status: 'suspended', team: 'Support', joined: 'Nov 22, 2024', lastActive: 'Jul 29, 2026 · 9:03 AM' },
  { id: '5', name: 'Ibrahim', email: 'ibrahim@tayyib.ma', role: 'Admin', status: 'active', team: 'Platform', joined: 'Mar 18, 2025', lastActive: 'Aug 16, 2026 · 11:20 AM' },
  { id: '6', name: 'Mohammed', email: 'mohammed@noor.ma', role: 'Viewer', status: 'active', team: 'Finance', joined: 'May 05, 2025', lastActive: 'Aug 15, 2026 · 6:41 PM' },
  { id: '7', name: 'Salem', email: 'salem@ihsan.ma', role: 'Editor', status: 'active', team: 'Growth', joined: 'Jun 14, 2025', lastActive: 'Aug 15, 2026 · 3:55 PM' },
  { id: '8', name: 'Faisal', email: 'faisal@sidq.ma', role: 'Member', status: 'suspended', team: 'Support', joined: 'Sep 01, 2024', lastActive: 'Jul 02, 2026 · 1:14 PM' },
  { id: '9', name: 'Tariq', email: 'tariq@rayyan.ma', role: 'Admin', status: 'active', team: 'Platform', joined: 'Jan 29, 2025', lastActive: 'Aug 16, 2026 · 9:02 AM' },
  { id: '10', name: 'Yassir', email: 'yassir@rahma.ma', role: 'Member', status: 'invited', team: 'Design', joined: 'Aug 08, 2026', lastActive: 'Never' },
  { id: '11', name: 'Abdullah', email: 'abdullah@salam.ma', role: 'Editor', status: 'active', team: 'Growth', joined: 'Apr 09, 2025', lastActive: 'Aug 14, 2026 · 7:33 PM' },
  { id: '12', name: 'Ahmed', email: 'ahmed@fajr.ma', role: 'Viewer', status: 'active', team: 'Finance', joined: 'Jul 20, 2025', lastActive: 'Aug 14, 2026 · 2:08 PM' },
  { id: '13', name: 'Bilal', email: 'bilal@najah.ma', role: 'Member', status: 'active', team: 'Support', joined: 'Oct 11, 2024', lastActive: 'Aug 13, 2026 · 9:47 AM' },
  { id: '14', name: 'Anas', email: 'anas@huda.ma', role: 'Member', status: 'invited', team: 'Design', joined: 'Aug 05, 2026', lastActive: 'Never' },
  { id: '15', name: 'Ayoub', email: 'ayoub@karama.ma', role: 'Admin', status: 'active', team: 'Platform', joined: 'Dec 02, 2024', lastActive: 'Aug 16, 2026 · 12:10 PM' },
  { id: '16', name: 'Hicham', email: 'hicham@hayat.ma', role: 'Editor', status: 'suspended', team: 'Growth', joined: 'Feb 27, 2025', lastActive: 'Jun 18, 2026 · 4:26 PM' },
  { id: '17', name: 'Mehdi', email: 'mehdi@safa.ma', role: 'Viewer', status: 'active', team: 'Finance', joined: 'May 30, 2025', lastActive: 'Aug 12, 2026 · 8:15 AM' },
  { id: '18', name: 'Zakaria', email: 'zakaria@bayan.ma', role: 'Member', status: 'active', team: 'Support', joined: 'Mar 03, 2025', lastActive: 'Aug 11, 2026 · 5:30 PM' },
  { id: '19', name: 'Ismail', email: 'ismail@amin.ma', role: 'Editor', status: 'active', team: 'Growth', joined: 'Jan 15, 2025', lastActive: 'Aug 10, 2026 · 10:02 AM' },
  { id: '20', name: 'Sofiane', email: 'sofiane@khayr.ma', role: 'Member', status: 'invited', team: 'Design', joined: 'Aug 02, 2026', lastActive: 'Never' },
  { id: '21', name: 'Reda', email: 'reda@rizq.ma', role: 'Viewer', status: 'active', team: 'Finance', joined: 'Jul 07, 2025', lastActive: 'Aug 09, 2026 · 3:48 PM' },
  { id: '22', name: 'Nabil', email: 'nabil@mawaddah.ma', role: 'Admin', status: 'active', team: 'Platform', joined: 'Sep 19, 2024', lastActive: 'Aug 16, 2026 · 1:05 PM' },
]

export type UserStat = {
  id: string
  label: string
  value: string
  change: number
  icon: LucideIcon
}

export const userStats: UserStat[] = [
  { id: 'total', label: 'Total Users', value: '22', change: 9.6, icon: UsersIcon },
  { id: 'active', label: 'Active Now', value: '16', change: 4.2, icon: UserCheck },
  { id: 'new', label: 'New This Month', value: '5', change: 18.3, icon: UserPlus },
  { id: 'admins', label: 'Admins', value: '4', change: 0, icon: ShieldCheck },
]

export type UsersData = {
  stats: UserStat[]
  users: AppUser[]
}

/**
 * Simulates an async data fetch, mirroring fetchDashboardData so the Users
 * page can reuse the same loading / error / retry pattern.
 */
export function fetchUsersData(
  { forceError = false, delay = 900 }: { forceError?: boolean; delay?: number } = {},
): Promise<UsersData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (forceError) {
        reject(new Error('Failed to load users'))
        return
      }
      resolve({ stats: userStats, users })
    }, delay)
  })
}
