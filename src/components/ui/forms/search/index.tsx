import { HTMLProps } from 'react'

import { SearchIcon } from '@/components/common'
import { cn } from '@/lib/utils'

interface SearchInputProps extends Omit<HTMLProps<HTMLInputElement>, 'size'> {
  hideIcon?: boolean
}
export const SearchInput: React.FC<SearchInputProps> = ({ hideIcon, className, ...props }) => {
  return (
    <label className="relative">
      {!hideIcon && <SearchIcon size={16} className="absolute text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />}
      <input
        type="search"
        className={cn(
          'bg-dark-gray py-3 rounded-xl pr-4 focus:outline-nonw focus:shadow-none focus-visible:outline-none w-full',
          className,
          !hideIcon ? 'pl-11' : 'pl-4'
        )}
        placeholder="Search"
        {...props}
      />
    </label>
  )
}
