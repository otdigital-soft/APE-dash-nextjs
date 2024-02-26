'use client'

import {
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import clsx from 'clsx'
import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'

import { Loading } from '@/components/ui/button'
import { monthsSimple } from '@/lib/utils'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface LineChartProps {
  labels?: string[]
  options?: ChartOptions['line']
  height?: number
  data?: ChartData<'line', number[], string>['datasets'] | null
  chartClassname?: string
  tickCallback?: (value: string) => string
  maxTicksLimit?: number
  loading?: boolean
}
export const LineChart: React.FC<LineChartProps> = ({
  labels = monthsSimple,
  options: initialOptions,
  height = 120,
  data: initialData,
  tickCallback,
  maxTicksLimit,
  loading
}) => {
  const data = useMemo(() => {
    return {
      labels,
      datasets: initialData || []
    }
  }, [labels, initialData])

  const options: Record<string, any> = useMemo(() => {
    return {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#3A3A3A'
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: tickCallback,
            beginAtZero: false,
            stepSize: 2,
            maxTicksLimit: maxTicksLimit
          }
        }
      },
      ...initialOptions
    }
  }, [initialOptions, tickCallback, maxTicksLimit])
  return (
    <div className="relative">
      {loading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loading />
        </div>
      )}
      <Line
        key={height}
        options={options}
        data={data}
        height={height}
        className={clsx(loading && 'opacity-20 filter blur-sm')}
      />
    </div>
  )
}
