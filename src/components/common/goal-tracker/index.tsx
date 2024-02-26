'use client'
import moment from 'moment'
import { useState } from 'react'
import toast from 'react-hot-toast'
import useSWR, { mutate as triggerMutation } from 'swr'

import { confirm } from '@/components/alerts/confirmation'
import { GoalTrackerForm } from '@/components/forms/goal-tracker'
import { Loading } from '@/components/ui/button'
import {
  CLAIM_REWARD_CONFIRM_MESSAGE,
  GET_GOAL_TRACKER_GROWTH,
  GET_GOAL_TRACKER_HISTORY,
  GET_MY_ACTIVE_TRACKER,
  RESET_TRACKER_CONFIRM_MESSAGE,
  RESET_TRACKER_HASPROGRESS_CONFIRM_MESSAGE,
  RESET_TRACKER_UNALLOWED_CONFIRM_MESSAGE
} from '@/restapi/goal-tracker/constants'
import { claimGoalTrackerReward, resetGoalTracker } from '@/restapi/goal-tracker/mutation'
import { fetcher } from '@/services/fetcher'

import { ActiveTracker } from './active-tracker'

export const GoalTracker: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const { data, mutate, isLoading, isValidating } = useSWR<RestApi.Response<GoalTracker.Entity>>(
    GET_MY_ACTIVE_TRACKER,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true
    }
  )

  const handleResetTracker = async () => {
    let confirmMessage = RESET_TRACKER_CONFIRM_MESSAGE
    const hasProgress = data?.data?.achieved?.calls || data?.data?.achieved?.sales
    const isExpired = moment.unix(data?.data?.expiresAt || 0).isBefore(moment())
    // if user is already half way
    const isHalfWay = moment.unix(data?.data?.expiresAt || 0).diff(moment(), 'hours') <= 6
    if (isHalfWay && !isExpired) {
      toast.error(RESET_TRACKER_UNALLOWED_CONFIRM_MESSAGE)
      return
    }
    // if user has progress, but the tracker is passed
    if (hasProgress && !isExpired) {
      confirmMessage = RESET_TRACKER_HASPROGRESS_CONFIRM_MESSAGE
    }
    setLoading(true)
    try {
      const confirmation = await confirm(confirmMessage, 'Reset', 'Cancel', {
        title: 'Reset Goal Tracker ?'
      })
      if (!confirmation) return
      await resetGoalTracker()
      mutate()
      triggerMutation(GET_GOAL_TRACKER_GROWTH)
      triggerMutation(GET_GOAL_TRACKER_HISTORY)
      toast.success('Goal tracker has been reset.')
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong, please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleClaimReward = async (data?: GoalTracker.Entity) => {
    if (!data?._id) return
    setClaiming(true)
    try {
      const confirmMessage = CLAIM_REWARD_CONFIRM_MESSAGE
      const confirmation = await confirm(confirmMessage, 'Claim', 'Cancel', {
        title: 'Claim Reward ?'
      })
      if (!confirmation) return
      await claimGoalTrackerReward(data?._id).then(() => {
        toast.success('Reward claimed successfully.')
      })
      mutate()
      triggerMutation(GET_GOAL_TRACKER_GROWTH)
      triggerMutation(GET_GOAL_TRACKER_HISTORY)
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong, please try again later.')
    } finally {
      setClaiming(false)
    }
  }

  if (isLoading && !isValidating) {
    return (
      <div className="min-h-10rem flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  return (
    <div className="relative">
      {isValidating && (
        <div className="absolute right-0 top-0">
          <Loading />
        </div>
      )}
      {data?.data && data?.data != null ? (
        <ActiveTracker
          data={data?.data}
          onTrackerDone={mutate}
          onResetTracker={handleResetTracker}
          resetLoading={loading}
          disabled={isValidating}
          onClaimReward={handleClaimReward}
          claimLoading={claiming}
        />
      ) : (
        <GoalTrackerForm onSetGoalTracker={mutate} disabled={isValidating} />
      )}
    </div>
  )
}
