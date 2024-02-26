import useSWR from 'swr'

import { permissionOptions } from '@/constants/app'
import { GET_IAN_STRIPE_CONNECTION, GET_STRIPE_CONFIG } from '@/restapi/finances/constants'
import { IANStripeResponse, StripeConfig } from '@/restapi/finances/finance'
import { GET_ME, GET_MY_PERMISSIONS } from '@/restapi/users/constants'
import { User } from '@/restapi/users/user'

export const useMe = (query?: Record<string, any>, isReady = true) => {
  const { data, ...rest } = useSWR<RestApi.Response<User.Entity>>(
    isReady ? GET_ME + (query ? `?${new URLSearchParams(query)}` : '') : null
  )

  return { ...rest, data, me: data?.data }
}

const permissions = permissionOptions.map((item) => item.value)
export const usePermission = (key?: (typeof permissions)[number]) => {
  const { data } = useSWR<RestApi.Response<boolean>>(key ? GET_MY_PERMISSIONS + `/${key}` : null)

  return data?.data
}
export const useStripeConfig = () => {
  const { data, ...rest } = useSWR<RestApi.Response<StripeConfig>>(GET_STRIPE_CONFIG)
  return { ...rest, data }
}

export const useStripeIANConnection = () => {
  const { data, ...rest } = useSWR<RestApi.Response<IANStripeResponse>>(GET_IAN_STRIPE_CONNECTION)
  return { ...rest, data }
}
