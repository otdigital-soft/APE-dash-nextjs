import moment from 'moment'
import { useMemo } from 'react'
import Countdown from 'react-countdown'
import { MdOutlineRestartAlt } from 'react-icons/md'
import { PiClockCountdownBold } from 'react-icons/pi'

import { Alert } from '@/components/alerts/alert'
import { Button } from '@/components/ui'
import { useClaimableReward } from '@/hooks/use-rewards'
import { getAchieves } from '@/lib/goal-tracker-helper'
import { cn } from '@/lib/utils'

// import { useClaimableReward } from '@/hooks/use-rewards'

interface ActiveTrackerProps {
  data?: GoalTracker.Entity
  onTrackerDone?: () => void
  onResetTracker?: () => void
  resetLoading?: boolean
  claimLoading?: boolean
  disabled?: boolean
  onClaimReward?: (data?: GoalTracker.Entity) => void
}

const countdownRenderer = ({ hours, minutes, seconds, completed }: Record<string, any>) => {
  if (completed) {
    // Render a completed state
    return <span>Expired.</span>
  } else {
    // Render a countdown
    return (
      <span>
        {hours !== 0 && <span>{hours} Hours </span>}
        {minutes !== 0 && <span>{minutes} Min </span>}
        {seconds !== 0 && <span>{seconds} Sec</span>}
      </span>
    )
  }
}

export const ActiveTracker: React.FC<ActiveTrackerProps> = ({
  data,
  onTrackerDone,
  onResetTracker,
  onClaimReward,
  resetLoading,
  disabled,
  claimLoading
}) => {
  const isExpired = useMemo(() => {
    return moment.unix(data?.expiresAt || 0).isBefore(moment())
  }, [data?.expiresAt])

  const achieved = useMemo(() => {
    if (!data)
      return {
        calls: null,
        sales: null,
        both: null
      }
    return getAchieves(data)
  }, [data])
  const { isClaimable, reward } = useClaimableReward(achieved?.both ? `gt-${data?._id}-reached` : null)

  const messages = useMemo(
    () =>
      ({
        achieved: {
          variant: 'success',
          title: 'Congratulations!',
          description: 'You reached your daily goal! You’re crushin’ it! Keep up the hard work and here’s [x] $HSL 🔥'
        },
        achievedRemainingTime: {
          variant: 'success',
          title: 'Congratulations!',
          description: 'You reached your daily goal! You’re crushin’ it! Keep up the hard work and here’s [x] $HSL 🔥'
        },
        notAchieved: {
          variant: 'danger',
          title: 'Goal Not Achieved.',
          description: 'You have not achieved your goal. You will not receive your reward.'
        },
        betLose: {
          variant: 'danger',
          title: 'Goal Not Achieved.',
          description:
            'You have lost your bet. You will not receive your reward and [x] $HSL will be deducted from your SC Wallet.'
        }
      } as const),
    []
  )

  const alerts = useMemo(() => {
    if (!data) return null
    // if user is achieved but the time is not expired
    if (achieved.both && !isExpired) return messages.achievedRemainingTime
    // otherwise, if it's not expired yet, return nothing
    if (!isExpired) return null

    // if its bet and the user not meet the goal
    if (data.type === 'bet' && !achieved.both) return messages.betLose
    // if its earn and the user meet the goal
    if (data.type === 'earn') {
      if (achieved.both) return messages.achieved
      if (!achieved.both) return messages.notAchieved
    }
  }, [achieved, messages, data, isExpired])
  return (
    <div>
      <span className="block">
        <div className="relative inline-flex space-x-3 items-center">
          <span className="text-xl font-bold">Tracker Active</span>
          <span
            className={cn(
              'py-px px-2 rounded-md h-fit border text-xs font-semibold uppercase',
              data?.type === 'earn' ? 'border-secondary text-secondary' : 'border-red-500 text-red-500'
            )}>
            {data?.type}
          </span>
        </div>
        {!isExpired && (
          <p className="text-sm text-gray-300">Your goal tracker is active. You will earn $HSL once you reach your goal.</p>
        )}
      </span>
      {/* goal alert */}
      {alerts && <Alert className="my-3" {...alerts} disableClose />}

      <div className="flex justify-center space-x-5 divide-x divide-stoke my-3">
        {data?.goals?.calls !== 0 && (
          <div className="flex flex-col text-center">
            <span className="text-5xl font-bold">
              {data?.achieved?.calls}/{data?.goals?.calls}
            </span>
            <span className="text-sm text-gray-200">Calls</span>
          </div>
        )}

        {data?.goals?.sales !== 0 && (
          <div className="flex flex-col text-center last:pl-5">
            <span className="text-5xl font-bold">
              {data?.achieved?.sales}/{data?.goals?.sales}
            </span>
            <span className="text-sm text-gray-200">Sales</span>
          </div>
        )}
      </div>
      {/* if expiresAt is passed */}
      {!isExpired && (
        <div className="flex space-x-1 mt-5 items-center">
          <PiClockCountdownBold />
          <Countdown
            date={moment.unix(data?.expiresAt || 0)?.valueOf()}
            renderer={countdownRenderer}
            onComplete={onTrackerDone}
          />
        </div>
      )}

      <div className="mt-2 flex items-center space-x-2">
        {alerts?.variant === 'success' && isClaimable && (
          <Button
            size="sm"
            variant="outline"
            className="space-x-1 border-primary transition-all"
            onClick={() => onClaimReward?.(data)}
            loading={claimLoading}>
            🔥 Claim {reward?.amount} $HSL
          </Button>
        )}
        {!isClaimable && (
          <Button
            size="sm"
            variant="danger"
            className="space-x-1 hover:bg-red-600 transition-all disabled:pointer-events-none"
            onClick={() => onResetTracker?.()}
            loading={resetLoading}
            disabled={disabled}>
            {!resetLoading && <MdOutlineRestartAlt />}
            <span>Reset Tracker</span>
          </Button>
        )}
      </div>
    </div>
  )
}
