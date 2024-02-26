import useSWR from 'swr'

import { GET_CLAIMABLE_REWARDS } from '@/restapi/rewards/constant'

export const useClaimableReward = (name: string | null) => {
  const { data, ...rest } = useSWR<RestApi.Response<Reward.ClaimableReward>>(GET_CLAIMABLE_REWARDS + `/${name}`)
  return { ...rest, data, isClaimable: data?.data?.type === 'ok', reward: data?.data?.reward }
}
