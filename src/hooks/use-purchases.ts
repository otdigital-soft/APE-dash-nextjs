import QueryString from 'qs'
import useSWR from 'swr'

import { GET_WEEKLY_SALES } from '@/restapi/finances/constants'
// prettier-ignore
import {
    CREATE_PURCHASE, CREATE_SUBSCRIPTION, GET_ACTIVE_SUBSCRIPTIONS, GET_FLATRATES, GET_PURCHASES,
    GET_PURCHASES_ALL, GET_SUBSCRIPTIONS, TEST, UPDATE_PURCHASE
} from '@/restapi/purchases/constants'

export const usePurchases = () => {
  const { data, isLoading } = useSWR<RestApi.Response<Purchase.Entity[]>>(GET_PURCHASES)
  return { data, isLoading }
}

export const usePurchasesByUser = (userId?: string) => {
  const data = useSWR<RestApi.Response<Purchase.Entity[]>>(
    userId
      ? GET_PURCHASES_ALL +
          '?' +
          QueryString.stringify({
            user: userId,
            state: 'completed'
          })
      : null
  )
  return data
}

export const useAdd = () => {
  const { data } = useSWR<RestApi.Response<Purchase.Entity>>(CREATE_PURCHASE)
  return { data }
}

export const useTest = () => {
  const { data } = useSWR<RestApi.Response<Purchase.Entity>>(TEST)
  return { data }
}

export const useAddSubscription = () => {
  const { data } = useSWR<RestApi.Response<Purchase.Entity>>(CREATE_SUBSCRIPTION)
  return { data }
}

export const useUpdate = () => {
  const { data } = useSWR<RestApi.Response<Purchase.Entity>>(UPDATE_PURCHASE)
  return { data }
}

export const useGetSubscriptions = () => {
  const { data } = useSWR<RestApi.Response<Purchase.Entity>>(GET_SUBSCRIPTIONS)
  return { data }
}

export const useGetFlatrates = () => {
  const data = useSWR<RestApi.Response<Purchase.Entity>>(GET_FLATRATES)
  return data
}

export const useGetActiveSubscriptions = (stripe_price_id: string) => {
  const { data, isLoading } = useSWR<RestApi.Response<Purchase.Entity[]>>(
    GET_ACTIVE_SUBSCRIPTIONS + '?stripe_price_id=' + stripe_price_id
  )
  return { data, isLoading }
}

export const useThisWeekSubscriptions = () => {
  // const params = QueryString.stringify({
  //   stripe_price_id: stripe_price_id,
  //   // nestjs lte gte
  //   created: {
  //     $lte: moment().endOf('week').unix(),
  //     $gte: moment().startOf('week').unix()
  //   }
  // })
  const { data, isLoading } = useSWR<RestApi.Response<number>>(GET_WEEKLY_SALES)
  return { data, isLoading }
}
