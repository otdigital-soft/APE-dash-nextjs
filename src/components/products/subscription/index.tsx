'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import { PaymentButton } from '@/components/common/payment-button'
import { toCurrency } from '@/lib/utils'

export const Subscription: React.FC = () => {
  const monthlyPrice = 300
  const [isPaymentWaiting, setIsPaymentWaiting] = useState(false)

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
    <div className="bg-primary rounded-xl p-5 flex flex-col space-y-5 h-full">
      <div>
        <h1 className="text-lg font-bold">Organic Growth</h1>
        <span className="text-sm text-white text-opacity-70">
          Let our team explode your organic reach using the same methods fortune 500 companies use to explode their business.
          You will also get a $75 discount off guaranteed customers
        </span>
        <div className="text-sm ml-0 text-white text-opacity-70 mt-0">
          <ul>
            <li>✔ Professionally writing a monthly targeted article to boost SEO</li>
            <li>✔ Growing your social media presence with organic content(Twitter & Instagram)</li>
            <li>✔ Building your SEO campaign & backlinking(10 high DA backlinks a month)</li>
          </ul>
          <span>Beta Features:</span>
          <ul>
            <li>✔ A monthly newsletter sent to your customers & prospects</li>
            <li>✔ Access to a lead database(“Outreach Center”) with leads you can reach out to.</li>
          </ul>
          <span>Features Coming Soon:</span>
          <ul>
            <li>✔ Automated SMS & Email scripts to send to your leads in lead database</li>
            <li>
              ✔ Integrated ChatGPT into your article / blog center on the management dashboard for instant article writing!
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between lg:space-x-5">
        <span className="text-3xl font-bold">Total: {toCurrency(monthlyPrice, false)}</span>
        <div className="flex space-x-3">
          <PaymentButton
            title="Pay with USHD"
            message="subscription"
            price={monthlyPrice}
            paymentMethod="usdh"
            data={{ quantity: 1, stripe_price: 'price_1MFPAGCOIb8tHxq5WuDeEww9' }}
            subscriptionPeriod="monthly"
            priceApprove={monthlyPrice * 11}
            setIsWaiting={setIsPaymentWaiting}
          />
          <PaymentButton
            title="Pay with Stripe"
            message="subscription"
            price={monthlyPrice}
            paymentMethod="stripe"
            data={{ quantity: 1, stripe_price: 'price_1MFPAGCOIb8tHxq5WuDeEww9' }}
            subscriptionPeriod="monthly"
            priceApprove={monthlyPrice * 11}
            setIsWaiting={setIsPaymentWaiting}
          />
        </div>
      </div>
    </div>
  )
}
