import { Button } from '@/components/ui'

import { Dropdown, DropdownProps } from '../dropdown'

interface ChartFiltersProps extends Omit<DropdownProps, 'el'> {
  filters?: string[]
  active?: string
  onChange?: (value: any) => void
}

export const ChartFilters: React.FC<ChartFiltersProps> = ({ active = 'Revenue', onChange, filters, ...rest }) => {
  return (
    <Dropdown
      el={<Button text={active} variant="outline" size="sm" className="pr-8" />}
      chevronClass="right-2"
      hideCarret
      {...rest}>
      <div className="flex flex-col space-y-3 py-1">
        {filters?.map((filter, i) => (
          <button key={i} className="py-2 px-5 hover:bg-dark-gray text-left" onClick={() => onChange?.(filter)}>
            {filter}
          </button>
        ))}
      </div>
    </Dropdown>
  )
}
