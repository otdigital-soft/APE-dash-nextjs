import useSWR from 'swr'

import { ChartIcon } from '@/components/common'
import { Card } from '@/components/common/card'
import { Loading } from '@/components/ui/button'
import { GET_CHURNED_REVENUE_REPORT } from '@/restapi/finances/constants'
import { ChurnRate } from '@/restapi/finances/finance'

export const Churn: React.FC = () => {
  const { data, isLoading } = useSWR<RestApi.Response<ChurnRate>>(GET_CHURNED_REVENUE_REPORT, {
    refreshInterval: 1000 * 60 * 60 * 24 // 24 hours
  })
  return (
    <Card title="Churn" headerElement={<ChartIcon className="mt-1 lg:mt-0" color="#CA43CD" />}>
      <h1 className="text-4xl text-#CA43CD font-semibold min-h-10 flex items-center">
        {isLoading ? <Loading /> : (data?.data?.churnRate || 0).toFixed(2) + '%'}
      </h1>
    </Card>
  )
}
