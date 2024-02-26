'use client'
import { useMemo } from 'react'
import useSWR from 'swr'

import { Card } from '@/components/common/card'
import { BarChart } from '@/components/common/chart'
// import { Dropdown } from '@/components/common/dropdown'
// import { Button } from '@/components/ui'
import { GET_STRIPE_CPA } from '@/restapi/finances/constants'
import { StripeCPA } from '@/restapi/finances/finance'

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
export const CPAChart: React.FC = () => {
  const { data } = useSWR<RestApi.Response<StripeCPA>>(GET_STRIPE_CPA)

  const cpaReport = useMemo(() => {
    if (!data) return null

    const dataset = data?.data?.data?.map((item) => item.cpa || 0)
    const labels = data?.data?.data?.map((item) => {
      return item?.monthShort || ''
    })
    return {
      labels: labels || [],
      dataset: dataset || []
    }
  }, [data])

  const chart = useMemo(() => {
    if (!cpaReport) return null
    return {
      labels: cpaReport.labels,
      datasets: [
        {
          label: 'Stripe CPA',
          data: cpaReport.dataset,
          backgroundColor: '#2D99FF',
          borderRadius: 8,
          maxBarThickness: 24,
          borderSkipped: false
        }
      ]
    }
  }, [cpaReport])

  return (
    <Card
      title="Cost Per Action"
      headerStyle={{
        fontSize: '1.25rem'
      }}>
      <BarChart data={chart} />
    </Card>
  )
}
