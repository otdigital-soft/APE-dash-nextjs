import useSWR from 'swr'

import { MoneyBagIcon } from '@/components/common'
import { Card } from '@/components/common/card'
import { Loading } from '@/components/ui/button'
import { nCurrencyFormatter, toCurrency } from '@/lib/utils'
import { Revenue as IRevenue } from '@/restapi/finances/finance'
import { statsUrl } from '@/stores/stats-url'
import { useHookstate } from '@hookstate/core'

export const Revenue: React.FC = () => {
  const url = useHookstate(statsUrl)

  const { data, isLoading } = useSWR<RestApi.Response<IRevenue>>(url?.value?.revenue, {
    refreshInterval: 1000 * 60 * 60 * 24 // 24 hours
  })
  return (
    <Card title="Revenue" headerElement={<MoneyBagIcon className="mt-1 lg:mt-0" color="#20CB27" />}>
      <h1 className="text-4xl text-#20CB27 font-semibold min-h-10 flex items-center">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <span className="hidden md:inline-block">{toCurrency(data?.data?.transactions?.amount || 0, true)}</span>
            <span className="inline-block md:hidden">
              $ {nCurrencyFormatter((data?.data?.transactions?.amount || 0) / 100)}
            </span>
          </>
        )}
      </h1>
    </Card>
  )
}
