import api from '@/services/api'

import { GET_0AUTH_TOKEN } from './constants'

export const auth0 = async (data: StripeApi.Auth0Dto): Promise<Record<string, any>> => {
  const SECRET = process.env.STRIPE_SECRET_KEY
  if (!SECRET) throw new Error('STRIPE_SECRET_KEY is not defined')

  return await api
    .post(GET_0AUTH_TOKEN, data, {
      headers: {
        Authorization: `Bearer ${SECRET}`
      }
    })
    .then(({ data }) => data)
    .catch((err) => {
      console.log(err?.response?.data)
      throw new Error(JSON.stringify(err?.response?.data))
    })
}
