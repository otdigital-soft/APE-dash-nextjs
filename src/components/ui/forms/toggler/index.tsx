'use client'
import clsx from 'clsx'
import { HTMLProps, useEffect, useState } from 'react'

import { Switch } from '@headlessui/react'

interface TogglerProps extends HTMLProps<HTMLInputElement> {
  onSwitch?: (state: boolean) => void
  defaultChecked?: boolean
}
export const Toggler: React.FC<TogglerProps> = ({ defaultChecked = false, onSwitch, disabled, ...props }) => {
  const [enabled, setEnabled] = useState(defaultChecked)

  const handleChange = (state: boolean) => {
    if (disabled) return
    setEnabled(state)
    onSwitch?.(state)
  }

  useEffect(() => {
    if (disabled) return
    if (typeof defaultChecked !== 'undefined') {
      setEnabled(defaultChecked)
    }
  }, [defaultChecked, disabled])
  return (
    <>
      <Switch
        checked={enabled}
        onChange={(state: boolean) => !disabled && handleChange(state)}
        className={clsx(
          enabled ? 'border-primary' : 'bg-transparent',
          'relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border items-center bg-primary'
        )}>
        <span
          aria-hidden="true"
          className={clsx(
            enabled ? 'translate-x-7 bg-white shadow' : 'translate-x-0 bg-white',
            'pointer-events-none inline-block h-6 w-6 transform rounded-full transition duration-200 ease-in-out'
          )}
        />
      </Switch>
      <input
        {...props}
        type="hidden"
        value={enabled?.toString()}
        onChange={() => !disabled && setEnabled(!enabled)}
        defaultChecked={defaultChecked}
      />
    </>
  )
}
