import QueryString from 'qs'
import useSWR from 'swr'

import { Business } from '@/restapi/businesses/business'

import { GET_BUSINESS } from '../restapi/businesses/constants'

export const useBusinesses = (params?: Record<string, any>) => {
  const query = QueryString.stringify(params, { skipNulls: true })
  const businesses = useSWR<RestApi.Response<Business[]>>(GET_BUSINESS + '?' + query)

  return businesses
}
