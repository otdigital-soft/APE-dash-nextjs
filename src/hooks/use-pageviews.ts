import QueryString from 'qs'
import useSWR from 'swr'

import { GET_GA_SETTINGS } from '@/restapi/ganalytics/constants'
import { Setting } from '@/restapi/settings/setting'
import api from '@/services/api'
import { statsUrl } from '@/stores/stats-url'
import { useHookstate } from '@hookstate/core'

export const usePageViews = (params?: Record<string, any>) => {
  const url = useHookstate(statsUrl)
  const { data: config, error: configError } = useSWR<RestApi.Response<Setting>>(GET_GA_SETTINGS)

  const ga_refresh_token = config?.data?.value?.refresh_token || api.defaults.headers.common?.ga_refresh_token
  const param = QueryString.stringify(
    {
      token: ga_refresh_token,
      cache: true,
      ...params
    },
    { skipNulls: true }
  )
  const fetchKey = !config && !configError ? null : `${url?.value?.pageviews}&${param}`

  const data = useSWR<RestApi.Response<GAnalytic.PageView[]>>(fetchKey)
  return data
}
