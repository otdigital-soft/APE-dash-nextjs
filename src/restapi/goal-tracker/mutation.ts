import api from '@/services/api'

import { CLAIM_GOAL_TRACKER_REWARD, CREATE_GOAL_TRACKER, RESET_ACTIVE_TRACKER } from './constants'

export const createGoalTracker = async (body: GoalTracker.CreateDto): Promise<RestApi.Response<GoalTracker.Entity>> => {
  return await api
    .post(CREATE_GOAL_TRACKER, body)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}
export const resetGoalTracker = async (): Promise<RestApi.Response<GoalTracker.Entity>> => {
  return await api
    .patch(RESET_ACTIVE_TRACKER)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}

export const claimGoalTrackerReward = async (id: string): Promise<RestApi.Response<GoalTracker.Entity>> => {
  return await api
    .post(`${CLAIM_GOAL_TRACKER_REWARD}/${id}`)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}
