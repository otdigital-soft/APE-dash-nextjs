import { useMemo, useState } from 'react'
import { MdClose } from 'react-icons/md'

import { cn } from '@/lib/utils'

export interface AlertProps {
  title?: string
  description?: string | React.ReactNode
  variant?: 'danger' | 'warning' | 'info' | 'success'
  icon?: React.ReactNode
  disableClose?: boolean
  className?: string
}
export const Alert: React.FC<AlertProps> = ({ title, description, variant = 'info', icon, disableClose, className }) => {
  const [show, setShow] = useState(true)
  const theme = useMemo(() => {
    let style = {
      bg: 'bg-secondary',
      text: 'text-secondary'
    }
    switch (variant) {
      case 'warning':
        style = {
          bg: 'bg-yellow-100',
          text: 'text-yellow-500'
        }
        break
      case 'success':
        style = {
          bg: 'bg-green-100',
          text: 'text-green-500'
        }
        break
      case 'danger':
        style = {
          bg: 'bg-red-500',
          text: 'text-red-300'
        }
        break
    }
    return style
  }, [variant])

  if (!show) return <></>
  return (
    <div className={cn('relative p-3 rounded-xl bg-opacity-10', theme.bg, className)}>
      <div className="flex">
        {icon && <div className={cn('flex-shrink-0 mt-1', theme.text)}>{icon}</div>}
        <div className="ml-3 lg:w-3/4 mr-5 lg:mr-0">
          {title && <h3 className={cn('font-semibold', theme.text)}>{title}</h3>}
          {description && (
            <div className={cn('text-sm', theme.text)}>
              <p>{description}</p>
            </div>
          )}
        </div>
      </div>
      {!disableClose && (
        <button
          className={cn('absolute right-5 top-1/2 transform -translate-y-1/2 text-xl', theme.text)}
          onClick={() => setShow(false)}>
          <MdClose />
        </button>
      )}
    </div>
  )
}
