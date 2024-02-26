import api from '@/services/api'

import { GENERATE_CRM_ACCOUNT } from './constants'

export const generateCRMAccount = async (body: Record<string, any>) => {
  const response = await api
    .post(GENERATE_CRM_ACCOUNT, body, {
      baseURL: process.env.CRM_API_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(({ data }) => data)
  return response
}
