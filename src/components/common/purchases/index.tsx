'use client'
import moment from 'moment'
import { useMemo } from 'react'

import { usePurchases } from '@/hooks/use-purchases'
import { cn, toCurrency } from '@/lib/utils'

import { Loading } from '../../ui/button'

// const purchases = {
//   time: 0,
//   amount: 0,
//   method: 'Card',
//   ID: '123123',
//   package: 'flatrate',
//   price: 375,
//   state: 'pending'
// } as const
interface PurchasesProps {
  className?: string
}
export const Purchases: React.FC<PurchasesProps> = ({ className }) => {
  const { data, isLoading } = usePurchases()

  const purchases = useMemo(() => {
    if (!data) return null
    return data?.data?.map((purchase) => {
      return {
        price: purchase?.price,
        amount: purchase?.payment_intent?.amount,
        time: purchase?.created,
        package: purchase?.name,
        state: purchase?.state,
        method: purchase?.payment_intent?.payment_method_types?.join(', '),
        ID: purchase?._id
      }
    })
  }, [data])
  return (
    <div className={cn('bg-dark-gray p-5 rounded-xl', className)}>
      <h2 className="text-lg font-bold">My Purchases</h2>
      <span className="text-sm font-medium">Overview of your past purchases.</span>
      {isLoading && (
        <div className="flex justify-center items-center my-5">
          <Loading />
        </div>
      )}
      {!isLoading && (
        <div className="divide-y divide-#3A3A3A flex flex-col max-h-20rem overflow-y-auto">
          {purchases?.map((purchase, i) => (
            <div key={i} className="grid grid-cols-2 gap-3 py-5">
              <div className="bg-dark rounded-xl flex justify-between p-3 text-sm">
                <span className="capitalize">Price</span>
                <span>{toCurrency(purchase?.price || 0)}</span>
              </div>
              <div className="bg-dark rounded-xl flex justify-between p-3 text-sm">
                <span className="capitalize">Amount</span>
                <span>{toCurrency(purchase?.amount || 0)}</span>
              </div>
              <div className="bg-dark rounded-xl flex justify-between p-3 text-sm">
                <span className="capitalize">Time</span>
                <span>{moment.unix(purchase?.time).format('LL L')}</span>
              </div>
              <div className="bg-dark rounded-xl flex justify-between p-3 text-sm">
                <span className="capitalize">Method</span>
                <span>{purchase?.method}</span>
              </div>
              <div className="bg-dark rounded-xl flex justify-between p-3 text-sm">
                <span className="capitalize">ID</span>
                <span>{purchase?.ID}</span>
              </div>
              <div className="bg-dark rounded-xl flex justify-between p-3 text-sm">
                <span className="capitalize">Package</span>
                <span>{purchase?.package}</span>
              </div>
              <div className="bg-dark rounded-xl flex justify-between p-3 text-sm">
                <span className="capitalize">State</span>
                <span>{purchase?.state}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <span className="text-sm">
        In case there are any problems, please reach out to us! If possible mention the ID of the purchase.
      </span>
    </div>
  )
}
