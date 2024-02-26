import moment from 'moment'
import { useMemo } from 'react'
import useSWR from 'swr'

import { RINGCENTRAL_AUTH_URL } from '@/constants/app'
import { GET_RINGCENTRAL_CONNECTION } from '@/restapi/connections/constants'
import { fetcher } from '@/services/fetcher'

export const useRingCentral = () => {
  const { data } = useSWR<RestApi.Response<Connection.Entity>>(GET_RINGCENTRAL_CONNECTION, fetcher, {
    revalidateOnFocus: true
  })

  const openAuthWindow = () => {
    window.open(RINGCENTRAL_AUTH_URL, 'RingCentral', 'width=500,height=800')
  }

  const mappedData = useMemo(() => {
    if (!data?.data) {
      return {
        isExpired: true,
        isConnected: false,
        isAvailable: false
      }
    }
    const isExpired = moment.unix((data?.data?.refreshTokenExpiresIn || 0) + (data?.data?.grantedAt || 0)).isBefore(moment())
    const isConnected = !!data?.data
    const isAvailable = !isExpired && isConnected
    return {
      isExpired,
      isConnected,
      isAvailable
    }
  }, [data])

  return {
    data,
    openAuthWindow,
    ...mappedData
  }
}
