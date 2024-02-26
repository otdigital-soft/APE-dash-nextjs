'use client'

import { useMemo } from 'react'
import useSWR from 'swr'

import { Card } from '@/components/common/card'
import { LineChart } from '@/components/common/chart'
// import { Dropdown } from '@/components/common/dropdown'
// import { Button } from '@/components/ui'
import { useBreakpoint } from '@/hooks/use-breakpoint'
import { GET_STRIPE_CUSTOMER_GROWTH } from '@/restapi/finances/constants'
import { StripeCustomerGrowth } from '@/restapi/finances/finance'

// const DropdownFilter: React.FC = () => {
//   return (
//     <Dropdown el={<Button text="Yearly" variant="outline" size="sm" className="pr-8" />} chevronClass="right-2" hideCarret>
//       <div className="flex flex-col space-y-3 py-1">
//         <button className="py-2 px-5 hover:bg-dark-gray text-left">Monthly</button>
//         <button className="py-2 px-5 hover:bg-dark-gray text-left">Weekly</button>
//       </div>
//     </Dropdown>
//   )
// }
export const GrowthChart: React.FC = () => {
  const { data } = useSWR<RestApi.Response<StripeCustomerGrowth>>(GET_STRIPE_CUSTOMER_GROWTH)
  const breakpoint = useBreakpoint()

  const chartHeight = useMemo(() => {
    if (breakpoint === 'lg') return 100
    if (breakpoint === 'md') return 150
    if (breakpoint === 'sm') return 200
    return 185
  }, [breakpoint])

  const customerGrowth = useMemo(() => {
    if (!data) return null
    const labels = data?.data?.data?.map((item) => item.monthShort || '')
    const dataset = data?.data?.data?.map((item) => item?.thisYear || 0)
    return {
      labels: labels || [],
      dataset: dataset || []
    }
  }, [data])

  const chart = useMemo(() => {
    if (!customerGrowth) return null
    return {
      labels: customerGrowth.labels,
      datasets: [
        {
          label: 'Growth Chart',
          data: customerGrowth.dataset,
          borderColor: '#CD9D43',
          pointBackgroundColor: 'transparent',
          pointBorderColor: 'transparent',
          pointRadius: 10,
          lineTension: 0.5
        }
      ]
    }
  }, [customerGrowth])

  return (
    <Card
      title="Growth Chart"
      headerStyle={{
        fontSize: '1.25rem'
      }}
      // headerElement={<DropdownFilter />}
      className="max-w-full overvflow-scroll">
      <LineChart height={chartHeight} data={chart?.datasets} labels={chart?.labels} />
    </Card>
  )
}
