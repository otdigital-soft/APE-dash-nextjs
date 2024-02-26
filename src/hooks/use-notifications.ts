import { useEffect, useState } from 'react'
import useSWR from 'swr'

import { GET_NOTIFICATIONS } from '@/restapi/notifications/constant'
import { updateNotificationStatus } from '@/restapi/notifications/mutations'

import { useMe } from './use-me'
import { Notification, useWebSocket } from './use-websocket'

type UseNotification = () => {
  notifications: Notification[]
  allNotifications: Notification[]
  readNotification: (id: string, index?: number) => Promise<void>
}

export const useNotifications: UseNotification = () => {
  const { me } = useMe()
  const { notifications: liveNotifications } = useWebSocket()
  const { data: notify, mutate } = useSWR<RestApi.Response<Notification[]>>(
    me?._id ? `${GET_NOTIFICATIONS}/${me?._id}` : null
  )

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [allNotifications, setAllNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const notifs = [...(notify?.data || []), ...liveNotifications] as Notification[]
    // remove duplicate notifications
    setAllNotifications(notifs)
    const uniqueNotif = notifs.filter((v, i, a) => a.findIndex((t) => t._id === v._id) === i)
    setNotifications(uniqueNotif)
  }, [notify, liveNotifications])

  const readNotification = async (id: string, index?: number) => {
    // if there is no id, it means it comes from websocket, so we don't need to update the status
    // only update the notifications state
    if (!id) {
      // remove notification based on index
      // find notifications with no _id
      const notif = notifications.filter((item) => !item._id)
      if (!notif) return
      const notifs = [...notif]
      notifs.splice(index || 0, 1)
      setNotifications(notifs)
      return
    }
    await updateNotificationStatus(id)
      .then(() => {
        mutate()
      })
      .catch(() => null)
  }

  return {
    notifications,
    readNotification,
    allNotifications
  }
}
