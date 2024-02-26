'use client'
import { Card } from '@/components/common/card'
import { useStripeBalance } from '@/hooks/use-stripe-balance'
import { cutString, toCurrency } from '@/lib/utils'

// import { Button } from '../ui'

interface PaymentHistoryCardProps {
  trxId: string
  date: number
  amount: number
  status?: 'pending' | 'success' | 'failed'
}
const PaymentHistoryCard: React.FC<PaymentHistoryCardProps> = ({ date, trxId, amount, status = 'success' }) => {
  return (
    <div className="bg-dark flex items-center py-2 px-4 rounded-xl">
      <div className="lg:w-8/12 flex space-y-3 flex-col w-full">
        <span className="break-words" title={trxId}>
          {cutString(trxId, 10, 10)}
        </span>
        <span className="text-white text-opacity-50">{date}</span>
      </div>
      <div className="flex-1 text-xl lg:text-3xl text-right">
        <span className={status === 'success' ? 'text-green' : 'text-red'}>{toCurrency(amount)}</span>
      </div>
    </div>
  )
}
export const RecentTransactions: React.FC = () => {
  const { payout_transactions } = useStripeBalance()
  return (
    <Card title="Recent Transaction">
      <p className="mb-3">These are you gross transactions, pre stripe & HUSL Fees</p>
      <div className="flex flex-col space-y-2 max-h-21rem overflow-y-auto">
        {payout_transactions?.map((item, i) => (
          <PaymentHistoryCard
            key={i}
            trxId={item?.tx_hash}
            amount={item?.value || 0}
            date={item?.timestamp}
            status={item?.status}
          />
        ))}
      </div>
    </Card>
  )
}
