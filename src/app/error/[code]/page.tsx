'use client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Button } from '@/components/ui'

import type { NextLayoutComponentType } from 'next'
const errors = {
  '403': {
    title: 'Forbidden',
    description: 'You do not have permission to access this resource.'
  },
  '500': {
    title: 'Internal Server Error',
    description: 'Something went wrong.'
  },
  '404': {
    title: 'Not Found',
    description: 'The resource you requested could not be found.'
  }
}

const ErrorPage: NextLayoutComponentType = () => {
  const params = useParams()
  const code = (params.code?.toString() || '500') as keyof typeof errors
  const { prefetch } = useRouter()

  useEffect(() => {
    prefetch('/')
  }, [prefetch])
  return (
    <div className="px-6 w-full flex items-center justify-center h-screen text-center">
      <div className="flex flex-col items-center bg-dark-gray w-xl rounded-xl px-5 py-8 shadow border border-#3A3A3A">
        <h1 className="text-6xl font-bold text-red-500">
          {code} {errors[code].title}
        </h1>
        <p className="text-lg text-white">{errors[code].description}</p>
        <Button url="/" className="mt-5" variant="outline">
          Go to Homepage
        </Button>
      </div>
    </div>
  )
}

export default ErrorPage
