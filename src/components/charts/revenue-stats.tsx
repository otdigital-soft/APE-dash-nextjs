'use client'
import { useCallback } from 'react'
import useSWR from 'swr'

import { Card } from '@/components/common/card'
// import { Dropdown } from '@/components/common/dropdown'
import { useStripeBalance } from '@/hooks/use-stripe-balance'
import { toCurrency } from '@/lib/utils'
import { GET_REVENUE_REPORT } from '@/restapi/finances/constants'
import { Revenue } from '@/restapi/finances/finance'
import { statsUrl } from '@/stores/stats-url'
import { useHookstate } from '@hookstate/core'

import { Loading } from '../ui/button'

// const dropdownClass = {
//   containerClass: 'text-sm pr-6 text-primary',
//   dropdownClass: 'w-164px',
//   margin: 4,
//   dropdownPadding: 0,
//   direction: 'bottom-right',
//   hideCarret: true
// } as const
export const RevenueStats: React.FC = () => {
  const { data, isLoading } = useSWR<RestApi.Response<Revenue>>(GET_REVENUE_REPORT)
  const { balance, amount_due } = useStripeBalance()

  const url = useHookstate(statsUrl)

  const { data: revenue } = useSWR<RestApi.Response<Revenue>>(url?.value?.revenue)

  // todo: add onclick
  const footer = useCallback((text: string) => {
    return (
      <>
        <span className="text-sm text-white text-opacity-75">{text}</span>
        {/* <Dropdown el="All Time" {...dropdownClass}>
          <div className="flex flex-col space-y-3 py-1">
            <button className="py-2 px-5 hover:bg-dark-gray text-left">This Year</button>
          </div>
        </Dropdown> */}
      </>
    )
  }, [])

  return (
    <div className="grid lg:grid-cols-4 lg:gap-5 gap-y-5">
      <Card footerElement={footer('Gross Revenue')}>
        {isLoading ? (
          <div className="h-9 flex items-center">
            <Loading />
          </div>
        ) : (
          <h1 className="text-3xl font-semibold">{toCurrency(data?.data?.allTransactions?.amount || 0)}</h1>
        )}
      </Card>
      <Card footerElement={footer('Monthly Balance')}>
        <h1 className="text-3xl font-semibold">{toCurrency(balance >= 0 ? balance / 1e16 : 0)}</h1>
      </Card>
      <Card footerElement={footer('Monthly Pending')}>
        <h1 className="text-3xl font-semibold">{toCurrency(amount_due)}</h1>
      </Card>
      <Card footerElement={footer('Today Revenue')}>
        <h1 className="text-3xl font-semibold">{toCurrency(revenue?.data?.todayTransactions?.amount || 0)}</h1>
      </Card>
    </div>
  )
}
