import api from '@/services/api'

import { GET_FOUNDER_CARDS, STORE_PAYOUT } from './constants'

export const getFounderCards = async (token_id: string | number): Promise<number[]> => {
  return await api
    .get(GET_FOUNDER_CARDS + `?token_id=${token_id}`)
    .then(({ data }) => data.data)
    .catch((err) => {
      console.error(err)
    })
}

export const store_payout = async (user_receiver: string, amount_in_cents: number, transaction: any): Promise<number> => {
  return await api
    .get(
      STORE_PAYOUT +
        `?user_id=${user_receiver}&amount_in_cents=${amount_in_cents}&transaction=` +
        JSON.stringify(transaction)
    )
    .then(({ data }) => data.data)
    .catch((err) => {
      throw new Error(err)
    })
}
