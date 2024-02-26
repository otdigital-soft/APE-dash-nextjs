import api from '@/services/api'

import { REQ_RINGCENTRAL_0AUTH_TOKEN } from './constants'

export const requestRingcentralToken = async (body?: Connection.RequestRCTokenDto) => {
  const response = await api.post(REQ_RINGCENTRAL_0AUTH_TOKEN, body).then(({ data }) => data)
  return response
}
