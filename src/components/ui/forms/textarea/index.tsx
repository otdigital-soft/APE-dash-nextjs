import { HTMLProps, useMemo } from 'react'

import { cn } from '@/lib/utils'

interface TextAreaProps extends Omit<HTMLProps<HTMLTextAreaElement>, 'size'> {
  className?: string
  label?: string
  hint?: string
  variant?: 'default' | 'error' | 'success' | 'dark'
  append?: React.ReactNode | string
  containerClass?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
}

export const TextArea: React.FC<TextAreaProps> = ({
  className,
  label,
  required,
  hint,
  variant = 'default',
  containerClass,
  error,
  size = 'md',
  ...rest
}) => {
  const theme = useMemo(() => {
    let className = {
      labelColor: 'text-white',
      hintColor: 'text-gray-400',
      borderColor: 'border-dark border-opacity-0'
    }
    switch (variant) {
      case 'error':
        className = {
          labelColor: 'text-danger',
          hintColor: 'text-danger',
          borderColor: 'border-danger'
        }
        break
      case 'success':
        className = {
          labelColor: 'text-success',
          hintColor: 'text-success',
          borderColor: 'border-success'
        }
        break
      case 'dark':
        className = {
          labelColor: 'text-white',
          hintColor: 'text-gray-400',
          borderColor: 'border-secondary'
        }
        break
      default:
        break
    }
    return className
  }, [variant])

  const sizes = useMemo(() => {
    let className = ''
    switch (size) {
      case 'sm':
        className = 'px-5 py-2'
        break
      case 'md':
        className = 'px-5 py-3'
        break
      case 'lg':
        className = 'px-8 py-4'
        break
      default:
        break
    }
    return className
  }, [size])

  return (
    <div className={cn('flex flex-col space-y-2', containerClass)}>
      {label && (
        <label className={cn('text-sm text-left', theme.labelColor)}>
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          rows={3}
          className={cn(
            'px-4 py-3 rounded-xl bg-transparent focus:outline-none border w-full font-light disabled:border-opacity-10 disabled:text-opacity-10 bg-dark',
            `placeholder:${theme.hintColor} placeholder:text-opacity-80`,
            theme.borderColor,
            sizes,
            className
          )}
          required={required}
          {...rest}
        />
      </div>
      {hint && <span className={cn('text-xs font-light text-left', theme.hintColor)}>{hint}</span>}
      {error && <span className={cn('text-xs font-light text-left text-red-400', theme.hintColor)}>{error}</span>}
    </div>
  )
}
