'use client'

import { UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useUsersData } from '@/lib/use-users-data'
import { ErrorState, StatCardsSkeleton, TableSkeleton } from './feedback'
import { StatCards } from './stat-cards'
import { UsersTable } from './users-table'

export function UsersPage() {
  const { status, data, retry } = useUsersData()

  const loading = status === 'loading'
  const error = status === 'error'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            Users
          </h1>
          <p className="text-sm text-muted-foreground">
            Invite teammates and manage roles &amp; access
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => toast.success('Invite link copied to clipboard')}
        >
          <UserPlus className="size-4" />
          Add User
        </Button>
      </div>

      {loading ? (
        <StatCardsSkeleton />
      ) : error ? (
        <ErrorState
          title="Couldn't load users"
          description="We hit a snag fetching your team members."
          onRetry={retry}
        />
      ) : (
        data && <StatCards stats={data.stats} />
      )}

      {loading ? (
        <TableSkeleton />
      ) : error ? null : (
        data && <UsersTable users={data.users} />
      )}
    </div>
  )
}
