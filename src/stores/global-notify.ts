import { NotifyId } from '@/components/alerts/global-notify'
import { hookstate } from '@hookstate/core'

export const closedAlerts = hookstate<NotifyId[]>([])

export const setClosedAlert = (key: NotifyId) => {
  // push to closedAlerts
  closedAlerts.set((prev) => {
    return [...prev, key]
  })
}
