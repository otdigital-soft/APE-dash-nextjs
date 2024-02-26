import api from '@/services/api'

import { UPDATE_SETTINGS } from './constants'
import { Setting } from './setting'

export const updateSetting = async (key: string, data: Record<string, any>): Promise<RestApi.Response<Setting>> => {
  return await api
    .patch(UPDATE_SETTINGS + key, data)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}

export const createSetting = async (data: Record<string, any>): Promise<RestApi.Response<Setting>> => {
  return await api
    .post(UPDATE_SETTINGS, data)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}
