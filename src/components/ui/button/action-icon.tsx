import { HTMLProps } from 'react'

import { cn } from '@/lib/utils'

export const ActionIcon: React.FC<HTMLProps<HTMLButtonElement>> = ({ children, type, className, ...rest }) => {
  return (
    <button
      type={(type as 'button') || 'button'}
      className={cn(
        'inline-flex items-center justify-center text-lg rounded-lg cursor-pointer group h-[42px] w-[42px] hover:bg-dark-gray hover:text-primary disabled:hover:bg-transparent disabled:pointer-events-none disabled:opacity-40',
        className
      )}
      {...rest}>
      {children}
    </button>
  )
}
