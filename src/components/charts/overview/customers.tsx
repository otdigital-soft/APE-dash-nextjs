import useSWR from 'swr'

import { UsersIcon } from '@/components/common'
import { Card } from '@/components/common/card'
import { Loading } from '@/components/ui/button'
import { StripeCustomer } from '@/restapi/finances/finance'
import { statsUrl } from '@/stores/stats-url'
import { useHookstate } from '@hookstate/core'

export const Customers: React.FC = () => {
  const url = useHookstate(statsUrl)
  const { data: customers, isLoading } = useSWR<RestApi.Response<StripeCustomer>>(url?.value?.customers)

  return (
    <Card title="Customers" headerElement={<UsersIcon className="mt-1 lg:mt-0" color="#CD9D43" />}>
      <h1 className="text-4xl text-#CD9D43 font-semibold min-h-10 flex items-center">
        {isLoading ? <Loading /> : (customers?.data?.totalCustomers || 0)?.toLocaleString()}
      </h1>
    </Card>
  )
}
