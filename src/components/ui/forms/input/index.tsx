'use client'
import { HTMLProps, useMemo, useState } from 'react'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'

import { cn } from '@/lib/utils'

interface InputProps extends Omit<HTMLProps<HTMLInputElement>, 'size'> {
  className?: string
  label?: string
  hint?: React.ReactNode | string
  variant?: 'default' | 'error' | 'success' | 'dark'
  append?: React.ReactNode | string
  prepend?: React.ReactNode | string
  containerClass?: string
  error?: string
  labelClassname?: string
  size?: 'sm' | 'md' | 'lg'
}

export const Input: React.FC<InputProps> = ({
  className,
  label,
  required,
  type: inputType,
  hint,
  variant = 'default',
  append,
  containerClass,
  error,
  prepend,
  labelClassname,
  size = 'md',
  ...rest
}) => {
  const [type, setType] = useState(inputType)

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
    let hintClassName = ''
    switch (size) {
      case 'sm':
        className = 'px-5 py-2'
        hintClassName = 'text-xs'
        break
      case 'md':
        className = 'px-5 py-3'
        hintClassName = 'text-sm'
        break
      case 'lg':
        className = 'px-8 py-4'
        hintClassName = 'text-base'
        break
      default:
        break
    }
    return { className, hintClassName }
  }, [size])
  return (
    <div className={cn('flex flex-col space-y-2', containerClass, type === 'hidden' && 'hidden')}>
      {label && (
        <label className={cn('text-sm text-left', theme.labelColor, labelClassname)}>
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="relative">
        {prepend && inputType !== 'password' && (
          <span className="absolute text-[#8C8CA1] transform -translate-y-1/2 top-1/2 left-3 text-base">{prepend}</span>
        )}
        <input
          type={type}
          className={cn(
            'rounded-xl bg-dark focus:outline-none border w-full disabled:border-opacity-10 disabled:text-opacity-10 disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            `placeholder:${theme.hintColor} placeholder:text-opacity-80`,
            theme.borderColor,
            sizes.className,
            className
          )}
          required={required}
          {...rest}
        />
        {inputType === 'password' && (
          <button
            type="button"
            className="absolute text-[#8C8CA1] transform -translate-y-1/2 top-1/2 right-5 text-base disabled:border-opacity-10 disabled:text-opacity-10"
            onClick={() => (type === 'password' ? setType('text') : setType('password'))}>
            {type === 'password' ? <MdVisibility className="text-lg" /> : <MdVisibilityOff className="text-lg" />}
          </button>
        )}
        {append && inputType !== 'password' && (
          <span className="absolute text-[#8C8CA1] transform -translate-y-1/2 top-1/2 right-3 text-base">{append}</span>
        )}
      </div>
      {hint && <span className={cn('font-light text-left', theme.hintColor, sizes.hintClassName)}>{hint}</span>}
      {error && (
        <span className={cn('font-light text-left text-red-400', theme.hintColor, sizes.hintClassName)}>{error}</span>
      )}
    </div>
  )
}
