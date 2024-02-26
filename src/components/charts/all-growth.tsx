'use client'

import dynamic from 'next/dynamic'
import QueryString from 'qs'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import { Card } from '@/components/common/card'
// import { ChartLegends } from '@/components/common/chart'
// import { Dropdown } from '@/components/common/dropdown'
// import { Button } from '@/components/ui'
import { chartColorOptions } from '@/constants/chart-data'
import { useBreakpoint } from '@/hooks/use-breakpoint'
import { usePageViews } from '@/hooks/use-pageviews'
import { dayShort, monthsSimple } from '@/lib/utils'
import { GET_REVENUE_REPORT, GET_STRIPE_CUSTOMERS } from '@/restapi/finances/constants'
import { Revenue as IRevenue, StripeCustomer } from '@/restapi/finances/finance'
import { GET_GA_PAGE_VIEWS } from '@/restapi/ganalytics/constants'
import { setStatsUrl, statsUrl } from '@/stores/stats-url'
import { useHookstate } from '@hookstate/core'

import { ChartFilters } from '../common/chart-filters'

const LineChart = dynamic(() => import('@/components/common/chart').then((mod) => mod.LineChart), {
  ssr: false
})

const filterValues = {
  'All Time': 'this_year',
  'Last 30 Days': 'last_month',
  'Last Week': 'last_week'
}
const timeFilters = ['Last Week', 'Last 30 Days', 'All Time']
const categoryFilters = ['Revenue', 'Customers', 'Website View']

export const AllGrowthChart: React.FC = () => {
  // const legends = useMemo(() => ['Customers', 'Website View', 'Revenue', 'Followers', 'Churn', 'Email Open Rate'], [])
  const url = useHookstate(statsUrl)
  const [activeFilter, setActiveFilter] = useState('Revenue')
  const [activeTimeFilter, setActiveTimeFilter] = useState<keyof typeof filterValues>('All Time')
  const [chartLabels, setChartLabels] = useState<string[]>()
  const breakpoint = useBreakpoint()

  const { data: revenue, isLoading } = useSWR<RestApi.Response<IRevenue>>(url?.value?.revenue, {
    refreshInterval: 1000 * 60 * 60 * 24 // 24 hours
  })
  const { data: customers } = useSWR<RestApi.Response<StripeCustomer>>(url?.value?.customers)
  const { data: pageViews } = usePageViews()

  const chartData = useMemo(() => {
    if (activeFilter === 'Revenue') {
      const revenues = {
        label: 'Revenue',
        data: revenue?.data?.stats?.data?.map((v) => v.amount / 100) || [],
        borderColor: revenue?.data?.stats?.data?.map((_, i) => chartColorOptions[i]),
        pointBackgroundColor: 'transparent',
        pointBorderColor: 'transparent',
        pointRadius: 10,
        lineTension: 0.5
      }
      const labels = revenue?.data?.stats?.label || []
      setChartLabels(labels)
      return [revenues]
    }
    if (activeFilter === 'Customers') {
      const custs = {
        label: 'Customers',
        data: customers?.data?.stats?.data?.map((v) => v.value || 0) || [],
        borderColor: customers?.data?.stats?.data?.map((_, i) => chartColorOptions[i]),
        pointBackgroundColor: 'transparent',
        pointBorderColor: 'transparent',
        pointRadius: 10,
        lineTension: 0.5
      }
      const labels = customers?.data?.stats?.label || []
      setChartLabels(labels || [])
      return [custs]
    }

    if (activeFilter === 'Website View') {
      const views = {
        label: 'Page Views',
        data: pageViews?.data?.map((v) => v.value || 0) || [],
        borderColor: pageViews?.data?.map((_, i) => chartColorOptions[i]),
        pointBackgroundColor: 'transparent',
        pointBorderColor: 'transparent',
        pointRadius: 10,
        lineTension: 0.5
      }
      const labels = pageViews?.data?.map((v) => {
        if (activeTimeFilter === 'All Time') {
          // get months short from moment
          const months = monthsSimple[v.label]
          return months
        }
        if (activeTimeFilter === 'Last 30 Days') {
          return v.label?.toString()
        }
        if (activeTimeFilter === 'Last Week') {
          // get days
          const days = dayShort[v.label - 1]
          return days
        }
        return monthsSimple[v.label]
      })
      setChartLabels(labels || [])
      return [views]
    }

    // const staticData = multiLine(legends)
    // return staticData
  }, [activeFilter, revenue, customers, pageViews, activeTimeFilter])

  const chartHeight = useMemo(() => {
    if (breakpoint === 'lg') return 100
    if (breakpoint === 'md') return 150
    if (breakpoint === 'sm') return 200
    return 100
  }, [breakpoint])

  useEffect(() => {
    const params = QueryString.stringify({
      reportType: filterValues[activeTimeFilter],
      cache: true
    })
    setStatsUrl('revenue', `${GET_REVENUE_REPORT}?${params}`)
    setStatsUrl('customers', `${GET_STRIPE_CUSTOMERS}?${params}`)
    setStatsUrl('pageviews', `${GET_GA_PAGE_VIEWS}?${params}`)
  }, [activeTimeFilter])
  return (
    <Card
      title="Growth"
      headerElement={
        <div className="flex items-center space-x-4">
          {/* <ChartLegends legends={legends} onLegendChange={setActiveLegends} className="hidden lg:flex" /> */}
          <ChartFilters filters={categoryFilters} active={activeFilter} onChange={setActiveFilter} />
          <ChartFilters
            filters={timeFilters}
            active={activeTimeFilter}
            onChange={setActiveTimeFilter}
            dropdownClass="min-w-10rem"
            direction="bottom-right"
          />
        </div>
      }>
      {/* Mobile legends */}
      {/* <ChartLegends
        legends={legends}
        onLegendChange={setActiveLegends}
        className="lg:hidden flex max-w-full overflow-x-auto mb-5"
      /> */}
      {chartHeight && (
        <LineChart
          height={chartHeight || 100}
          data={chartData}
          maxTicksLimit={10}
          labels={chartLabels}
          loading={isLoading}
        />
      )}
    </Card>
  )
}
