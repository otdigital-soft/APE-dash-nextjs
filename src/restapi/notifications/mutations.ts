import api from '@/services/api'

import { GET_NOTIFICATIONS } from './constant'

export const getNotificationsById = async (id: string) => {
  return await api
    .get(GET_NOTIFICATIONS + `/${id}`)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}
export const updateNotificationStatus = async (id: string) => {
  return await api
    .patch(GET_NOTIFICATIONS + `/${id}`)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}
