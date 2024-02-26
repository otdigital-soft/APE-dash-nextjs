'use client'
import useSWR from 'swr'

import { GET_CHURNED_REVENUE_REPORT } from '@/restapi/finances/constants'
import { ChurnRate as ChurnRateAPI } from '@/restapi/finances/finance'

import { Card } from '../common/card'
import { CircularProgressBar } from '../common/chart'

export const ChurnRate: React.FC = () => {
  const { data } = useSWR<RestApi.Response<ChurnRateAPI>>(GET_CHURNED_REVENUE_REPORT)

  return (
    <Card
      title="Churn Rate"
      headerStyle={{
        fontSize: '1.25rem'
      }}
      className="h-full">
      <div
        className="w-9/12 mx-auto flex"
        style={{
          height: 'calc(100% - 24px)'
        }}>
        <CircularProgressBar value={data?.data?.churnRate || 0} />
      </div>
    </Card>
  )
}
