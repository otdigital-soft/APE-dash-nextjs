import { Button } from '@/components/ui'

interface FounderCardTableActionsProps {
  onApproveAll: () => void
  onWithdrawAll: () => void
}
export const FounderCardTableActions: React.FC<FounderCardTableActionsProps> = ({ onApproveAll, onWithdrawAll }) => {
  return (
    <div className="flex lg:justify-between lg:items-center flex-col lg:flex-row space-y-3 lg:space-y-0">
      <div>
        <h1 className="text-xl font-bold">Your FounderCard Benefits</h1>
        <span className="text-white text-opacity-70">
          As a HUSL FounderCard holder, you will receive a share of all customer subscriptions of all businesses in the HUSL
          ecosystem.
        </span>
      </div>
      <div className="flex space-x-3 lg:justify-end">
        <Button onClick={onApproveAll} variant="outline" className="flex-1 lg:flex-auto">
          Approve All
        </Button>
        <Button onClick={onWithdrawAll} variant="outline" className="flex-1 lg:flex-auto">
          Withdraw All
        </Button>
      </div>
    </div>
  )
}
