import { Button } from '@/components/ui'
import { purchaseViaUSDH, subscribeViaStripe } from '@/restapi/purchases/mutation'

interface PaymentButtonProps {
  title: string
  message: string
  price: number
  data: Purchase.OptionalData
  priceApprove?: number
  setIsWaiting?: any
  subscriptionPeriod?: string | null
  paymentMethod: 'usdh' | 'stripe'
  disabled?: boolean
}
export const PaymentButton: React.FC<PaymentButtonProps> = ({
  title = 'Pay with USHD',
  message,
  price,
  data,
  priceApprove,
  setIsWaiting,
  paymentMethod = 'usdh',
  disabled = false
}) => {
  const handlePurchase = async () => {
    if (disabled) return
    if (paymentMethod === 'usdh') {
      await purchaseViaUSDH(message, price * (data.quantity || 1), priceApprove, data, setIsWaiting)
    } else {
      await subscribeViaStripe(message, price, data)
    }
  }
  return (
    <Button
      onClick={handlePurchase}
      variant="dark"
      className="text-sm lg:text-base flex-1 lg:flex-auto bg-transparent lg:bg-dark border border-primary border-opacity-50 lg:border-none disabled:bg-opacity-50 disabled:cursor-not-allowed"
      disabled={disabled}>
      {title}
    </Button>
  )
}
