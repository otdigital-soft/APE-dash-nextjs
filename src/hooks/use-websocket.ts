import { useEffect, useState } from 'react'
import socketIO, { Socket } from 'socket.io-client'

import { useMe } from '@/hooks/use-me'

const socketUrl = process.env.API_URL as string

export type Notification = {
  _id: string
  name: string
  title: string
  message: string
  content?: string
  type: string
  timestamp: number
  createdAt: number
  status?: boolean
}
export const useWebSocket = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)
  const { me } = useMe()

  useEffect(() => {
    // Initialize Socket.io
    const iosocket = socketIO(socketUrl, {
      query: {
        _id: me?._id
      }
    })

    // Add Socket.io event listeners or emit events
    iosocket.on('connect', () => {
      console.log('Connected to websocket server')
    })

    iosocket.on('message', (data) => {
      setNotifications([...notifications, data])
    })

    iosocket.on('private-event', (data) => {
      console.log(`Received room event: ${data.message}`)
    })

    setSocket(iosocket)

    return () => {
      // Clean up Socket.io connection if necessary
      iosocket.disconnect()
    }
  }, [me?._id, notifications])

  const removeNotification = (id: string) => {
    setNotifications((notifications) => notifications.filter((item) => item.id !== id))
  }
  return { socket, notifications, removeNotification }
}
