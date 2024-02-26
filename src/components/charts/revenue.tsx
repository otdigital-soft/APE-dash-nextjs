'use client'
import QueryString from 'qs'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import { Card } from '@/components/common/card'
import { LineChart } from '@/components/common/chart'
import { toCurrency } from '@/lib/utils'
import { GET_REVENUE_REPORT } from '@/restapi/finances/constants'
import { Revenue } from '@/restapi/finances/finance'
import { setStatsUrl, statsUrl } from '@/stores/stats-url'
import { useHookstate } from '@hookstate/core'

import { ChartFilters } from '../common/chart-filters'

const filterValues = {
  'All Time': 'this_year',
  'Last 30 Days': 'last_month',
  'Last Week': 'last_week'
}
const timeFilters = ['Last Week', 'Last 30 Days', 'All Time']

export const RevenueChart: React.FC = () => {
  const url = useHookstate(statsUrl)
  const [activeTimeFilter, setActiveTimeFilter] = useState<keyof typeof filterValues>('All Time')

  const { data, isLoading } = useSWR<RestApi.Response<Revenue>>(url?.value?.revenue)

  const revenueReport = useMemo(() => {
    if (!data) return null

    const dataset = data?.data?.stats?.data?.map((item) => (item?.amount || 0) / 100)
    const labels = data?.data?.stats?.label
    return {
      labels: labels || [],
      dataset: dataset || []
    }
  }, [data])

  const chart = useMemo(() => {
    if (!revenueReport) return null
    return {
      labels: revenueReport.labels,
      datasets: [
        {
          label: 'Stripe Revenue',
          data: revenueReport.dataset,
          borderColor: '#CD9D43',
          pointBackgroundColor: 'transparent',
          pointBorderColor: 'transparent',
          pointRadius: 10,
          lineTension: 0.5
        }
      ]
    }
  }, [revenueReport])

  useEffect(() => {
    const revenueParams = QueryString.stringify({
      reportType: filterValues[activeTimeFilter]
    })
    setStatsUrl('revenue', `${GET_REVENUE_REPORT}?${revenueParams}`)
  }, [activeTimeFilter])

  return (
    <Card
      title="Revenue"
      headerStyle={{
        fontSize: '1.25rem'
      }}
      headerElement={
        <ChartFilters
          filters={timeFilters}
          active={activeTimeFilter}
          onChange={setActiveTimeFilter}
          dropdownClass="min-w-10rem"
          direction="bottom-right"
        />
      }>
      <LineChart
        data={chart?.datasets}
        labels={chart?.labels}
        tickCallback={(value) => {
          return toCurrency(Number(value), false)
        }}
        loading={isLoading}
      />
    </Card>
  )
}
