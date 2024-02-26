'use client'
import { useState } from 'react'

import { chartColorOptions } from '@/constants/chart-data'
import { cn } from '@/lib/utils'

interface ChartLegendsProps {
  legends: string[]
  colors?: string[]
  onLegendChange?: (legend: string[]) => void
  className?: string
}
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean
  color?: string
}
const Checkbox: React.FC<CheckboxProps> = ({ color, checked, ...rest }) => {
  return (
    <label>
      <input
        type="checkbox"
        className="w-4 h-4 inline-block rounded-xl checked:bg-white border-none"
        style={{ accentColor: color }}
        defaultChecked={checked}
        {...rest}
      />
    </label>
  )
}
export const ChartLegends: React.FC<ChartLegendsProps> = ({
  legends = [],
  colors = chartColorOptions,
  onLegendChange,
  className
}) => {
  const [selectedLegends, setSelectedLegends] = useState<string[]>(legends)

  const handleLegendChange = (evt: React.ChangeEvent<HTMLInputElement>, legend: string) => {
    let selected = [...selectedLegends]
    if (evt.target.checked) {
      selected = [...selectedLegends, legend]
    } else {
      selected = selected.filter((l) => l !== legend)
    }
    setSelectedLegends(selected)
    onLegendChange?.(selected)
  }
  return (
    <div className={cn('flex space-x-5 items-center', className)}>
      {legends.map((legend, i) => (
        <label key={i} className="flex items-center space-x-2">
          <Checkbox
            color={colors[i]}
            checked={selectedLegends.includes(legend)}
            onChange={(evt) => handleLegendChange(evt, legend)}
          />
          <span className="text-xs text-ellipsis whitespace-nowrap">{legend}</span>
        </label>
      ))}
    </div>
  )
}
