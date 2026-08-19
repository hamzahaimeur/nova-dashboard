'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { fetchOrdersData, type OrdersData } from './orders-data'

export type LoadStatus = 'loading' | 'error' | 'success'

export function useOrdersData() {
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [data, setData] = useState<OrdersData | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async (opts?: { notify?: boolean }) => {
    if (opts?.notify) setRefreshing(true)
    else setStatus('loading')

    try {
      const result = await fetchOrdersData()
      setData(result)
      setStatus('success')
      if (opts?.notify) toast.success('Orders list updated')
    } catch {
      setStatus('error')
      if (opts?.notify) toast.error('Could not refresh orders')
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
