'use client'

import { useEffect } from 'react'

import { Loading } from '@/components/ui/button'

export default function CloseWindowPage() {
  useEffect(() => {
    window.close()
  }, [])

  return (
    <div className="flex flex-col space-y-3 items-center justify-center w-screen h-screen">
      <Loading />
      <h1 className="text-2xl font-bold">Closing window...</h1>
    </div>
  )
}
