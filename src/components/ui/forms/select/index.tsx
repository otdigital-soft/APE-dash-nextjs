'use client'
import { useMemo } from 'react'
import ReactSelect, { Props } from 'react-select'

import { cn } from '@/lib/utils'

export type ItemOption = {
  label?: string
  value?: string
}
export interface SelectProps extends Props {
  name?: string
  className?: string
  label?: string
  hint?: string
  variant?: 'default' | 'error' | 'success' | 'dark'
  required?: boolean
  placeholder?: string
  items?: ItemOption[]
  value?: ItemOption[]
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void
  onChange?: (value: any) => void
  isMulti?: boolean
  size?: 'sm' | 'md' | 'lg'
  bgColor?: string
}

export const Select: React.FC<SelectProps> = ({
  hint,
  variant,
  label,
  required,
  placeholder,
  className,
  items = [],
  setFieldValue,
  name,
  onChange,
  isMulti = false,
  size = 'md',
  bgColor = '!bg-dark',
  ...props
}) => {
  const handleChange = (selectedOptions: ItemOption[]) => {
    if (!name) return
    setFieldValue?.(name, selectedOptions)
    onChange?.(selectedOptions)
  }
  const theme = useMemo(() => {
    let className = {
      labelColor: 'text-white',
      hintColor: 'text-gray-400',
      borderColor: '!border-dark !border-opacity-0'
    }
    switch (variant) {
      case 'error':
        className = {
          labelColor: 'text-danger',
          hintColor: 'text-danger',
          borderColor: '!border-danger'
        }
        break
      case 'success':
        className = {
          labelColor: 'text-success',
          hintColor: 'text-success',
          borderColor: '!border-success'
        }
        break
      case 'dark':
        className = {
          labelColor: 'text-white',
          hintColor: 'text-gray-400',
          borderColor: '!border-secondary'
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
        className = 'px-2 py-0.5'
        break
      case 'md':
        className = 'py-2 px-2'
        break
      case 'lg':
        className = 'py-3'
        break
      default:
        break
    }
    return className
  }, [size])

  return (
    <div className="flex flex-col space-y-2 w-full">
      {label && (
        <label className={cn('text-sm text-left', theme.labelColor)}>
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <ReactSelect
        isMulti={isMulti}
        name="colors"
        options={items}
        className={cn('', `placeholder:${theme.hintColor} placeholder:text-opacity-80`, theme.borderColor, className)}
        classNamePrefix="select"
        placeholder={placeholder}
        classNames={{
          container: () => cn('p-0'),
          control: () =>
            cn(
              '!rounded-xl !focus:outline-none !border !w-full !disabled:border-opacity-10 !disabled:text-opacity-10',
              theme.borderColor,
              className,
              bgColor,
              sizes
            ),
          input: () => cn('!text-white'),
          dropdownIndicator: () => cn('!text-white'),
          clearIndicator: () => cn('!text-white'),
          placeholder: () => cn(`!text-white !text-opacity-50`),
          menu: () => cn('!rounded-xl !border !border-stoke', bgColor),
          option: () => cn('hover:!bg-dark-gray !rounded-xl !bg-opacity-50', bgColor),
          multiValue: () => cn('!rounded-xl !bg-opacity-50', bgColor),
          multiValueLabel: () => cn('!text-white border-l border-b border-t border-stoke !rounded-r-none !rounded-l-lg'),
          singleValue: () => cn('!text-white'),
          multiValueRemove: () =>
            cn('!text-white hover:!bg-danger border-t border-b border-r !rounded-l-none !rounded-r-lg border-stoke')
        }}
        isClearable
        onChange={(e: any) => {
          handleChange(e)
        }}
        {...props}
      />
      {hint && <span className={cn('text-xs', theme.hintColor)}>{hint}</span>}
    </div>
  )
}
