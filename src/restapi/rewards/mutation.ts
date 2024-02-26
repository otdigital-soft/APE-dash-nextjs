import api from '@/services/api'

import { CLAIM_REWARD, CLAIM_SALES_REWARD, GET_REWARD } from './constant'

export const claimReward = async (name: string) => {
  return await api
    .post(CLAIM_REWARD + `/${name}`)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}

export const claimSalesReward = async () => {
  return await api
    .post(CLAIM_SALES_REWARD)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}

export const getRewardById = async (id: string) => {
  return await api
    .get(GET_REWARD + `/${id}`)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}
