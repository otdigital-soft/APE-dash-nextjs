import { AxiosRequestConfig } from 'axios'

// import { Redis } from '@upstash/redis'
import api from './api'

// const redis = Redis.fromEnv()

export const fetcher = async (url: string | null, config?: AxiosRequestConfig) => {
  if (typeof url !== 'string' || !url || url === '') return null
  // get query object from url string
  const query = url.split('?')[1]
  // get query params from query string
  const params = new URLSearchParams(query)

  // const result: RestApi.Response<any> = {
  //   data: null,
  //   code: 200,
  //   message: '',
  //   status: 'success'
  // }

  // check if it has a cache param
  const cacheParam = params.get('cache')
  if (cacheParam && cacheParam == 'true') {
    // remove cache param from query string
    params.delete('cache')
    // const cache = await redis.get<RestApi.Response<any>>(url)
    // if (cache) {
    //   result.data = cache?.data
    //   result.message = 'loaded from cache: ' + url
    //   return result
    // }
  }

  return api
    .get(url, config)
    .then((res) => {
      // if (cacheParam && cacheParam == 'true') {
      //   result.data = res.data
      //   result.message = res?.data?.message || 'loaded from api: ' + url
      //   // redis.set(url, JSON.stringify(result.data), {
      //   //   // get expires from query string or set default to 1 hour
      //   //   ex: Number(params.get('cache_ex')) || 3600
      //   // })
      // }
      return res.data
    })
    .catch((e) => {
      throw new Error(e)
    })
}
