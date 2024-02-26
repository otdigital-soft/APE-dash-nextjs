type GoalAchieved = (tracker: GoalTracker.Entity) => {
  sales: boolean | null
  calls: boolean | null
  both: boolean
}
export const getAchieves: GoalAchieved = (tracker) => {
  let isSalesAchieved: boolean | null = tracker.achieved.sales >= tracker.goals.sales
  let isCallsAchieved: boolean | null = tracker.achieved.calls >= tracker.goals.calls

  // check if both or either sales or calls is achieved
  let achieved = false
  if (isSalesAchieved && isCallsAchieved) achieved = true

  // if there is no goals for sales or calls, then return null
  if (tracker.goals.sales == 0) isSalesAchieved = null
  if (tracker.goals.calls == 0) isCallsAchieved = null

  return {
    sales: isSalesAchieved,
    calls: isCallsAchieved,
    both: achieved
  }
}

export const isRewardClaimable = (tracker: GoalTracker.Entity) => {
  const { both } = getAchieves(tracker)
  const claimable = both && !tracker.isRewardClaimed
  let reason = 'Reward is already claimed'
  if (!both) reason = 'Goal failed to achieve'
  return {
    claimable,
    reason
  }
}
