import { GET_REVENUE_REPORT, GET_STRIPE_CUSTOMERS } from '@/restapi/finances/constants'
import { GET_GA_PAGE_VIEWS } from '@/restapi/ganalytics/constants'
import { hookstate } from '@hookstate/core'

type StatsUrl = {
  revenue: string
  customers: string
  pageviews: string
}

export const statsUrl = hookstate<StatsUrl>({
  revenue: GET_REVENUE_REPORT,
  customers: GET_STRIPE_CUSTOMERS,
  pageviews: GET_GA_PAGE_VIEWS
})

export const setStatsUrl = (key: keyof StatsUrl, value: string) => {
  statsUrl[key].set(value)
}
