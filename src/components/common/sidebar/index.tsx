'use client'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { menuState } from '@/stores/menu'
import { useHookstate } from '@hookstate/core'

import { BottomAction } from './bottom-action'

interface SidebarProps {
  menu?: 'main'
  permissions?: string[]
}
export const Sidebar: React.FC<SidebarProps> = ({ permissions }) => {
  const menuType = useHookstate(menuState)
  const pathname = usePathname()

  useEffect(() => {
    menuState.set('collapsed')
  }, [pathname])

  const Menu = useMemo(() => {
    const importPath = import('./navigation-list')
    return dynamic(() => importPath.then((mod) => mod.NavigationList), { ssr: false })
  }, [])
  return (
    <aside
      id="MAIN_SIDEBAR"
      className="bg-dark-gray text-gray-100 w-240px z-50 space-y-6 py-5 fixed left-0 top-0 lg:h-screen inset-y-0 transition duration-200 ease-in-out flex flex-col justify-between transition lg:!opacity-100 lg:!transform lg:!translate-x-0 max-h-screen overflow-y-auto mt-12 md:mt-0"
      style={{
        opacity: menuType.value === 'full' ? 1 : 0,
        transform: menuType.value === 'full' ? 'translateX(0)' : 'translateX(-100%)'
      }}>
      <div className="flex flex-col space-y-5 lg:space-y-8">
        {/* Logo */}
        <Link href="/" className="mx-auto hidden lg:block">
          <Image src="/static/images/logo.svg" alt="logo" width={82} height={42} />
        </Link>
        {/* Nav list */}
        <Menu permissions={permissions} />
      </div>
      {/* Bottom corner */}
      <BottomAction permissions={permissions} />
    </aside>
  )
}
