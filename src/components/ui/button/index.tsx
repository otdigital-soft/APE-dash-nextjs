import Link from 'next/link'
import { HTMLProps } from 'react'
import { VscLoading } from 'react-icons/vsc'

import { cn } from '@/lib/utils'

export type Variants = 'primary' | 'secondary' | 'dark' | 'outline' | 'none' | 'success' | 'danger' | 'dark-gray'
export type Sizes = 'xs' | 'sm' | 'md' | 'lg'
export type ExtraSizes = 'xl' | '2xl' | '3xl' | 'full'

interface ButtonProps extends Omit<HTMLProps<HTMLButtonElement & HTMLAnchorElement>, 'size'> {
  text?: string | JSX.Element
  variant?: Variants
  url?: string
  size?: Sizes
  rounded?: Sizes | ExtraSizes
  shadow?: Sizes
  external?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
}

interface LoadingProps {
  className?: string
}
export const Loading: React.FC<LoadingProps> = ({ className }) => (
  // <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  //   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  //   <path
  //     className="opacity-75"
  //     fill="currentColor"
  //     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  // </svg>
  <VscLoading className={cn('text-white animate-spin', className)} />
)
export const Button: React.FC<ButtonProps> = ({
  text,
  variant = 'primary',
  url,
  size = 'md',
  rounded = 'xl',
  shadow,
  external,
  className,
  type = 'button',
  disabled,
  children,
  loading,
  ...rest
}) => {
  const classNames = []
  switch (variant) {
    case 'primary':
      classNames.push('text-white bg-primary')
      break
    case 'secondary':
      classNames.push('text-white bg-secondary')
      break
    case 'dark':
      classNames.push('text-white bg-dark')
      break
    case 'outline':
      classNames.push('text-white border border-#3A3A3A')
      break
    case 'none':
      classNames.push('text-white')
      break
    case 'success':
      classNames.push('text-white bg-success')
      break
    case 'danger':
      classNames.push('text-white bg-red-500')
      break
    case 'dark-gray':
      classNames.push('text-white !bg-dark-gray')
      break
    default:
      classNames.push('bg-primary text-white')
      break
  }

  switch (size) {
    case 'xs':
      classNames.push('px-3 text-sm py-2px')
      break
    case 'sm':
      classNames.push('px-4 py-2 text-sm')
      break
    case 'md':
      classNames.push('px-5 py-0.6rem')
      break
    case 'lg':
      classNames.push('py-3 px-9')
      break
    default:
      classNames.push('px-5 py-0.6rem')
      break
  }

  if (shadow) {
    classNames.push(`shadow-${shadow}`)
  }

  // if button had a link
  if (url && !disabled) {
    return (
      <Link
        href={url}
        target={external ? '_blank' : '_self'}
        className={cn(
          ...classNames,
          className,
          'text-center disabled:border-#fafafa disabled:opacity-50 disabled:text-hint flex items-center justify-center',
          `rounded-${rounded}`
        )}
        {...(rest as any)}>
        {loading ? <Loading /> : text || children}
      </Link>
    )
  }
  // if not, then render plain button
  return (
    <button
      type={type}
      className={cn(
        ...classNames,
        className,
        'disabled:border-#fafafa disabled:opacity-50 disabled:text-hint flex items-center justify-center',
        `rounded-${rounded}`
      )}
      disabled={disabled || loading}
      {...rest}>
      {loading ? (
        <>
          <Loading className="mr-1" />
          {text || children}
        </>
      ) : (
        text || children
      )}
    </button>
  )
}

export default Button
