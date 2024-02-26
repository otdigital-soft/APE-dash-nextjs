'use client'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'

import { PaymentButton } from '@/components/common/payment-button'
import { Input, Select } from '@/components/ui/forms'
import { repetitionOptions } from '@/constants/app'
import { usePurchases } from '@/hooks/use-purchases'
import { cn, toCurrency } from '@/lib/utils'
import { getFlatrateStripePrice, isValidSubscriptionInPurchases } from '@/restapi/purchases/mutation'

interface FlatrateProps {
  className?: string
}

const PRICE = 37500
export const Flatrate: React.FC<FlatrateProps> = ({ className }) => {
  const [total, setTotal] = useState(PRICE)
  const [selectedRepetition, setSelectedRepetition] = useState(repetitionOptions[0])
  const [isPaymentWaiting, setIsPaymentWaiting] = useState(false)
  const purchases: any = usePurchases()

  const handleCalculate = (evt: ChangeEvent<HTMLInputElement>) => {
    const multiplier = PRICE // $375 per customer
    const value = Number(evt.target.value)
    const total = (value || 0) * multiplier
    setTotal(total)
  }

  const isSubscribed = isValidSubscriptionInPurchases(purchases?.data?.data)

  // const price_per_customer = getFlatratePrice(isSubscribed)
  const stripe_price_per_customer = getFlatrateStripePrice(isSubscribed, selectedRepetition?.value)

  const customers = useMemo(() => {
    return total / PRICE
  }, [total])

  const data = useMemo(() => {
    return {
      quantity: customers,
      repetition: selectedRepetition?.value,
      stripe_price: stripe_price_per_customer
    }
  }, [customers, selectedRepetition, stripe_price_per_customer])

  useEffect(() => {
    if (isPaymentWaiting) {
      toast.loading('Waiting for payment...', {
        id: 'autopilot-payment'
      })
    } else {
      toast.dismiss('autopilot-payment')
    }
  }, [isPaymentWaiting])

  return (
    <div className={cn('bg-#826AF9 rounded-xl p-5 flex flex-col space-y-5', className)}>
      <div>
        <h1 className="text-lg font-bold">Guaranteed Customers</h1>
        <p className="text-sm text-opacity-70 text-white">
          Pay per customer we get you, if we can&apos;t deliver, we&apos;ll credit your account! This saves you thousands of
          dollars in upfront marketing since we&apos;re paying the upfront cost of reaching a desired Cost Per Acquisition.
          You can either buy customers one time, or set up a recurring purchase.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <div className="flex flex-col lg:flex-row space-y-1 lg:space-x-3 text-xs lg:items-center">
          <span className="whitespace-nowrap">Amount of Customers</span>
          <Input type="number" className="lg:bg-opacity-30" onChange={handleCalculate} defaultValue={1} />
        </div>
        <div className="flex flex-col lg:flex-row space-y-1 lg:space-x-3 text-xs lg:items-center">
          <span className="whitespace-nowrap">Select Repetition</span>
          <Select
            name="repetition"
            items={repetitionOptions}
            value={[selectedRepetition]}
            className="lg:!bg-opacity-30"
            onChange={setSelectedRepetition}
            size="sm"
          />
        </div>
      </div>
      <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between lg:space-x-5">
        <span className="text-3xl font-bold">Total: {toCurrency(total)}</span>
        <div className="flex space-x-3">
          <PaymentButton
            title="Pay with USHD"
            message="flatrate"
            price={total}
            paymentMethod="usdh"
            subscriptionPeriod={['weekly', 'monthly'].includes(selectedRepetition?.value) ? selectedRepetition?.value : null}
            data={data}
            priceApprove={0}
            setIsWaiting={setIsPaymentWaiting}
            disabled={!selectedRepetition?.value || !customers}
          />
          <PaymentButton
            title="Pay with Stripe"
            message="flatrate"
            price={total}
            paymentMethod="stripe"
            data={data}
            setIsWaiting={setIsPaymentWaiting}
            disabled={!selectedRepetition?.value || !customers}
          />
        </div>
      </div>
    </div>
  )
}
