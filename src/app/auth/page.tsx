'use client'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useEffectOnce } from 'react-use'

import { ConnectWallet } from '@/components/common/connect-button'
import { AuthSigninForm } from '@/components/forms/auth/signin'
import { Loading } from '@/components/ui/button'
import { useHydrated } from '@/hooks/use-hydrated'

import type { NextLayoutComponentType } from 'next'
const AuthPage: NextLayoutComponentType = () => {
  const query = useSearchParams()
  const isHydrated = useHydrated()

  const signin = async (token: string) => {
    try {
      await signIn('jwt', { token })
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  useEffectOnce(() => {
    // prevent multiple render
    const id = setTimeout(() => {
      const token = query?.get('token')
      if (token) {
        // sini
        signin(token)
      }
    }, 100)
    return () => {
      clearTimeout(id)
    }
  })
  if (query?.get('token')) {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <Loading />
        <span>Logging you in...</span>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center bg-dark-gray w-md rounded-xl px-5 py-8 shadow border border-#3A3A3A">
      {/* HUSL Logo */}
      <Link href="/">
        <Image src="/static/images/logo.svg" width={120} height={50} className="object-contain" alt="logo" />
      </Link>
      {/* Login Form */}
      <div className="p-5 w-full max-w-sm">
        {!isHydrated ? (
          <div className="min-h-5rem flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          <AuthSigninForm />
        )}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-#3A3A3A"></div>
          <span className="flex-shrink mx-4 text-slate text-sm uppercase">OR</span>
          <div className="flex-grow border-t border-#3A3A3A"></div>
        </div>
        <ConnectWallet />
      </div>
    </div>
  )
}

export default AuthPage
