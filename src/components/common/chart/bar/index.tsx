'use client'

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js'
import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'

import { monthsSimple } from '@/lib/utils'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface BarChartProps {
  data?: ChartData<'bar', number[], string> | null
  options?: ChartOptions['bar']
  tickCallback?: (value: string) => string
  maxTicksLimit?: number
  height?: number
}
export const BarChart: React.FC<BarChartProps> = ({
  data: initData,
  options: initialOptions,
  tickCallback,
  maxTicksLimit,
  height
}) => {
  const data = useMemo(() => {
    return {
      labels: initData?.labels || monthsSimple,
      datasets: initData?.datasets || []
    }
  }, [initData])

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
    <div>
      <Bar options={options} data={data} height={height} />
    </div>
  )
}
