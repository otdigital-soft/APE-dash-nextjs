import Cookies from 'js-cookie'
import moment from 'moment'
import { useMemo } from 'react'

import { PRIVATE_RSS_COOKIE_NAME } from '@/constants/app'

export const usePrivateRss = () => {
  const requiresAuth = () => {
    const authCookie = Cookies.get(PRIVATE_RSS_COOKIE_NAME)
    // auth cookie is Basic Auth, contains nftId:password:requestedAt (unix)
    if (!authCookie) return true
    const [, , requestedAt] = atob(authCookie).split(':')
    // requestedAt is unix, expires in 30minutes, if it's expired, then we need to re-authenticate
    const expires = moment.unix(Number(requestedAt)).add(30, 'minutes')
    if (expires.isBefore(moment())) {
      // remove cookie
      Cookies.remove(PRIVATE_RSS_COOKIE_NAME)
      return true
    }
    return false
  }

  const setAuthCookie = (nftId: string, password: string) => {
    const requestedAt = moment().unix()
    const authCookie = btoa(`${nftId}:${password}:${requestedAt}`)
    Cookies.set(PRIVATE_RSS_COOKIE_NAME, authCookie)
  }

  const getToken = () => {
    const authCookie = Cookies.get(PRIVATE_RSS_COOKIE_NAME)
    if (!authCookie) return null
    return authCookie
  }
  const token = useMemo(() => {
    return getToken()
  }, [])

  return { requiresAuth, setAuthCookie, token, getToken }
}
