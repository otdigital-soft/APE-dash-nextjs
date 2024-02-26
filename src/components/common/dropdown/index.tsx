'use client'
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { AiFillCaretDown } from 'react-icons/ai'
import { MdChevronRight } from 'react-icons/md'

import { cn } from '@/lib/utils'
import { Menu, Transition } from '@headlessui/react'

export interface DropdownProps {
  el: JSX.Element | string
  dropdownClass?: string
  containerClass?: string
  children?: JSX.Element | JSX.Element[]
  direction?: 'left' | 'top' | 'bottom' | 'bottom-right'
  chevronClass?: string
  variant?: 'default' | 'dark-gray'
  hideCarret?: boolean
  margin?: number
  dropdownPadding?: number
  hideMenu?: boolean
  hideChevron?: boolean
  status?: boolean
}

export const Dropdown: React.FC<DropdownProps> = ({
  el,
  children,
  dropdownClass,
  containerClass,
  direction = 'bottom',
  chevronClass,
  variant = 'default',
  hideCarret = false,
  margin = 0,
  dropdownPadding = 4,
  hideMenu,
  hideChevron = false,
  status
}) => {
  const background = variant === 'default' ? 'bg-dark' : 'bg-dark-gray'
  const carretClass = variant === 'default' ? 'text-dark' : 'text-dark-gray'
  const ref = useRef<HTMLDivElement>(null)
  const [customOpen, setCustomOpen] = useState(false)
  const containerMargin = useMemo(() => {
    if (hideCarret) {
      if (margin) return margin
      return 10
    }
    return 12
  }, [hideCarret, margin])

  const menuButtonClicked = () => {
    if (status) setCustomOpen((prev) => !prev)
  }

  useEffect(() => {
    const checkIfClickedOutside: EventListener = (evt: Event) => {
      if (customOpen && ref.current && !ref.current.contains(evt.target as HTMLElement)) {
        setCustomOpen(false)
      }
    }
    document.addEventListener('mousedown', checkIfClickedOutside)
    if (!status) setCustomOpen(false)
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [customOpen, status])

  if (hideMenu) {
    return <>{el}</>
  }
  return (
    <Menu as="div" className={cn('flex items-center relative', containerClass)}>
      {({ open }) => (
        <>
          <Menu.Button as="div" className="w-full" onClick={menuButtonClicked}>
            {el}
            {!hideChevron && (
              <MdChevronRight
                size={20}
                className={cn(
                  'absolute top-1/2 transform -translate-y-1/2 right-0',
                  chevronClass,
                  open ? '-rotate-90' : 'rotate-90'
                )}
              />
            )}
          </Menu.Button>

          {!hideCarret && open && (
            <AiFillCaretDown
              className={cn(
                'absolute left-1/2 transform -translate-x-1/2 text-dark',
                carretClass,
                direction === 'top' && 'bottom-7',
                direction === 'bottom' && '-bottom-7 rotate-180'
              )}
              size={32}
            />
          )}
          {customOpen && (
            <Transition
              as={Fragment}
              show={customOpen}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0">
              <Menu.Items
                static
                ref={ref}
                className={cn(
                  dropdownClass,
                  'absolute flex flex-col justify-start overflow-auto text-base text-left rounded-lg shadow-frame focus:outline-none sm:text-sm z-30 shadow mt-3 w-full min-w-100px',
                  dropdownPadding,
                  background,
                  hideCarret && 'border border-dark-gray shadow',
                  direction === 'left' && 'right-0',
                  direction === 'bottom-right' && `top-${containerMargin} right-0`,
                  direction === 'top' && `bottom-${containerMargin} left-0`,
                  direction === 'bottom' && `top-${containerMargin} left-0`
                )}>
                <Menu.Item as="div">
                  {/* {
                    //@ts-ignore
                  ({ close }) => React.Children.map(children, child => React.cloneElement(child, { close }))
                  } */}
                  {children}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          )}
        </>
      )}
    </Menu>
  )
}
