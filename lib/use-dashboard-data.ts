'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { fetchDashboardData, type DashboardData } from './dashboard-data'

export type LoadStatus = 'loading' | 'error' | 'success'

function hasErrorFlag() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).has('error')
}

export function useDashboardData() {
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [data, setData] = useState<DashboardData | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  // Only the very first load honors the ?error flag; retries succeed.
  const firstLoad = useRef(true)

  const load = useCallback(
    async (opts?: { notify?: boolean }) => {
      const forceError = firstLoad.current && hasErrorFlag()
      if (opts?.notify) setRefreshing(true)
      else setStatus('loading')

      try {
        const result = await fetchDashboardData({ forceError })
        setData(result)
        setStatus('success')
        if (opts?.notify) toast.success('Data updated successfully')
      } catch {
        setStatus('error')
        if (opts?.notify) toast.error('Could not refresh data')
      } finally {
        firstLoad.current = false
        setRefreshing(false)
      }
    },
    [],
  )

  useEffect(() => {
    load()
  }, [load])

  return {
    status,
    data,
    refreshing,
    /** Re-fetch after an error (skeletons again). */
    retry: () => load(),
    /** Manual refresh with toast feedback. */
    refresh: () => load({ notify: true }),
  }
}
