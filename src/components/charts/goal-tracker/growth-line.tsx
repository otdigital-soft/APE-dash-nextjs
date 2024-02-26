'use client'

import { useMemo } from 'react'
import useSWR from 'swr'

import { Card } from '@/components/common/card'
import { LineChart } from '@/components/common/chart'
import { Loading } from '@/components/ui/button'
import { monthsSimple } from '@/lib/utils'
import { GET_GOAL_TRACKER_GROWTH } from '@/restapi/goal-tracker/constants'

export const GoalTrackerGrowth: React.FC = () => {
  const { data, isLoading } = useSWR<RestApi.Response<GoalTracker.Growth[]>>(GET_GOAL_TRACKER_GROWTH)

  const growth = useMemo(() => {
    const labels = monthsSimple
    const dataset = data?.data?.map((item) => item.reached || 0)
    const datasetAlt = data?.data?.map((item) => item.unreached || 0)
    const dataValue = data?.data?.map((item) => item.calls || 0)
    const dataValueAlt = data?.data?.map((item) => item.sales || 0)
    return {
      labels: labels || [],
      dataset: dataset || [],
      datasetAlt: datasetAlt || [],
      dataValue: dataValue || [],
      dataValueAlt: dataValueAlt || []
    }
  }, [data])

  const chart = useMemo(() => {
    if (!growth) return null
    return {
      labels: growth.labels,
      datasets: [
        {
          label: 'Goal Reached',
          data: growth.dataset,
          borderColor: '#2D99FF',
          pointBackgroundColor: 'transparent',
          pointBorderColor: 'transparent',
          lineTension: 0.5
        },
        {
          label: 'Goal Unreached',
          data: growth.datasetAlt,
          borderColor: '#f87171',
          pointBackgroundColor: 'transparent',
          pointBorderColor: 'transparent',
          lineTension: 0.5
        }
        // {
        //   label: 'Calls',
        //   data: growth.dataValue,
        //   borderDash: [7, 5],
        //   borderColor: 'rgba(205, 157, 67, .2)',
        //   pointBackgroundColor: 'transparent',
        //   pointBorderColor: 'transparent',
        //   lineTension: 0.5
        // },
        // {
        //   label: 'Sales',
        //   data: growth.dataValueAlt,
        //   borderDash: [7, 5],
        //   borderColor: 'rgba(205, 157, 67, .2)',
        //   pointBackgroundColor: 'transparent',
        //   pointBorderColor: 'transparent',
        //   lineTension: 0.5
        // }
      ]
    }
  }, [growth])

  return (
    <Card title="Goal Growth" className="max-w-full overvflow-scroll">
      {isLoading && (
        <div className="min-h-14rem flex items-center justify-center">
          <Loading />
        </div>
      )}
      {!isLoading && <LineChart data={chart?.datasets} labels={chart?.labels} maxTicksLimit={6} height={100} />}
    </Card>
  )
}
