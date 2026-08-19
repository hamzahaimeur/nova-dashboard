'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { fetchUsersData, type UsersData } from './users-data'

export type LoadStatus = 'loading' | 'error' | 'success'

export function useUsersData() {
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [data, setData] = useState<UsersData | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async (opts?: { notify?: boolean }) => {
    if (opts?.notify) setRefreshing(true)
    else setStatus('loading')

    try {
      const result = await fetchUsersData()
      setData(result)
      setStatus('success')
      if (opts?.notify) toast.success('Users list updated')
    } catch {
      setStatus('error')
      if (opts?.notify) toast.error('Could not refresh users')
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return {
    status,
    data,
    refreshing,
    retry: () => load(),
    refresh: () => load({ notify: true }),
  }
}
