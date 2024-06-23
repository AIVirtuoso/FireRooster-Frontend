'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStoreType } from '@/store'

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStoreType>()
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}