'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useCallback, useMemo } from 'react'
import { FiExternalLink, FiTarget } from 'react-icons/fi'
import { MdChevronLeft } from 'react-icons/md'

import { verifyPermissions } from '@/lib/verify-permissions'
import { Disclosure, Transition } from '@headlessui/react'

import * as Icon from '../icons'

export interface NavigationListProps {
  layout?: 'compact' | 'full'
  permissions?: string[]
}

export const NavigationList: React.FC<NavigationListProps> = ({ permissions = [] }) => {
  const pathname = usePathname()

  const isActivePath = useCallback((current?: string, path?: string) => {
    if (!current || !path) return
    const paths = path?.split('/')?.filter(String)
    // check if path is multiple
    if (paths.length > 1) {
      return ('/' + paths?.join('/')?.toLowerCase() + '/').startsWith(current?.toLowerCase() + '/')
    }
    return path == current
  }, [])

  const items = useMemo(() => {
    // if (!user?.user?.userType) return []
    return [
      {
        path: '/',
        label: 'Dashboard',
        icon: Icon.MenuIcon,
        childs: [
          {
            path: '/',
            label: 'My Stats',
            onClick: null,
            external: false
          },
          {
            path: '/stats/revenue',
            label: 'Revenue Stats',
            onClick: null,
            external: false
          }
        ]
      },
      {
        path: '/goal-tracker',
        label: 'Goal Tracker',
        icon: FiTarget
      },
      {
        path: '/courses',
        label: 'Training',
        icon: Icon.BookIcon
      },
      {
        path: '/access-manager',
        label: 'Access Manager',
        icon: Icon.UsersIcon
      },
      {
        path: '/brand-overview',
        label: 'Brand Overview',
        icon: Icon.OverviewKey
      },
      {
        path: '#!',
        label: 'Marketing',
        icon: Icon.CampaignIcon,
        childs: [
          {
            path: '/marketing/drive',
            label: 'My Drive',
            onClick: null,
            external: false
          },
          {
            path: '/marketing/social-setup',
            label: 'Social Account Setup',
            onClick: null,
            external: false
          },
          {
            path: '/marketing/blog',
            label: 'Blog',
            onClick: null,
            external: false
          }
        ]
      },
      {
        path: '/leaderboard',
        label: 'Leaderboard',
        icon: Icon.ChartIcon
      }
    ].filter(Boolean)
  }, [])

  return (
    <ul className="flex flex-col px-2 py-0 space-y-2">
      {items?.map((item, i) => (
        <Fragment key={i}>
          {verifyPermissions(item.path, permissions, true) && (
            <Fragment>
              {!item?.childs?.length && (
                <li>
                  <Link
                    href={item?.path}
                    className={clsx(
                      'flex px-3 md:px-5 space-x-3 py-3 rounded-xl transition-all items-center',
                      item.path === '/' && pathname === '/' && 'bg-dark',
                      item.path !== '/' && isActivePath(item.path, pathname) && 'bg-dark'
                    )}
                    target={(item as Record<string, unknown>)?.external ? '_blank' : '_self'}>
                    <span>
                      <item.icon size={22} />
                    </span>
                    <span>{item?.label}</span>
                  </Link>
                </li>
              )}
              {item?.childs?.length && (
                <Disclosure defaultOpen={isActivePath(item.path, pathname)}>
                  {({ open }) => (
                    <li>
                      <Disclosure.Button
                        className={clsx(
                          'flex px-3 md:px-5 space-x-3 py-3 transition-all items-center justify-between w-full',
                          item.path === '/' && pathname === '/' && 'bg-dark',
                          item.path !== '/' && isActivePath(item.path, pathname) && 'bg-dark',
                          open ? 'bg-dark rounded-t-xl' : 'rounded-xl'
                        )}>
                        <div className="flex items-center space-x-3">
                          <span>
                            <item.icon fill="currentColor" size={22} />
                          </span>
                          <span>{item?.label}</span>
                        </div>
                        <MdChevronLeft
                          className={clsx('text-2xl transform transition-transform', open ? 'rotate-90' : '-rotate-90')}
                        />
                      </Disclosure.Button>

                      <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                        className={clsx(
                          'flex flex-col space-y-2 bg-dark py-3',
                          open && 'border-t border-t-gray-700 rounded-b-xl'
                        )}>
                        {item?.childs?.map((child, i) => (
                          <Fragment key={i}>
                            {verifyPermissions(child.path, permissions, true) && (
                              <Disclosure.Panel as={Fragment}>
                                <div>
                                  {(child as Record<string, unknown>)?.onClick ? (
                                    <button
                                      onClick={(child as any)?.onClick}
                                      className={clsx(
                                        'px-8 py-2 hover:border-primary hover:text-primary border-l border-transparent inline-flex',
                                        child.path === '/' && pathname === '/' && '!border-primary text-primary',
                                        child.path !== '/' &&
                                          isActivePath(child.path, pathname) &&
                                          '!border-primary text-primary'
                                      )}>
                                      {child?.label}
                                      {child?.external && <FiExternalLink size={10} className="ml-2" />}
                                    </button>
                                  ) : (
                                    <Link
                                      href={child?.path}
                                      className={clsx(
                                        'px-8 py-2 hover:border-primary hover:text-primary border-l border-transparent inline-flex',
                                        child.path === '/' && pathname === '/' && '!border-primary text-primary',
                                        child.path !== '/' &&
                                          isActivePath(child.path, pathname) &&
                                          '!border-primary text-primary'
                                      )}>
                                      {child?.label}
                                      {child?.external && <FiExternalLink size={10} className="ml-2" />}
                                    </Link>
                                  )}
                                </div>
                              </Disclosure.Panel>
                            )}
                          </Fragment>
                        ))}
                      </Transition>
                    </li>
                  )}
                </Disclosure>
              )}
            </Fragment>
          )}
        </Fragment>
      ))}
    </ul>
  )
}
