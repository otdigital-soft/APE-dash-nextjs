import { useCallback, useEffect } from 'react'
import toast, { ToastOptions } from 'react-hot-toast'
import { PiWarningCircleFill } from 'react-icons/pi'

import { useMe } from '@/hooks/use-me'
import { useClaimableReward } from '@/hooks/use-rewards'
import { closedAlerts } from '@/stores/global-notify'
import { useHookstate } from '@hookstate/core'

export type NotifyId = 'no-password' | 'no-social-connector' | 'new-sales'
interface NotifiesProps {
  id: NotifyId
  data?: any
  callback?: (id: NotifyId, ...args: any) => void
}

type Notifies = (props: NotifiesProps) => {
  type?: 'success' | 'error' | 'loading'
  el?: JSX.Element
  icon?: JSX.Element | string
} | null

export const notifies: Notifies = ({ id, data, callback }) => {
  switch (id) {
    case 'no-password':
      return {
        type: 'error',
        el: (
          <button className="text-left" onClick={() => callback?.(id, data)}>
            Enter a password to make your account more secure. Click here to set a password.
          </button>
        )
      }
    case 'no-social-connector':
      return {
        type: 'error',
        el: (
          <button className="text-left" onClick={() => callback?.(id, data)}>
            Add your SocialConnector email if you want to receive $HSL rewards for building your business. If you don’t have
            an account, you’ll get an email with instructions
          </button>
        ),
        icon: (
          <div className="text-1.3rem text-yellow-600">
            <PiWarningCircleFill />
          </div>
        )
      }
    case 'new-sales': {
      return {
        type: 'success',
        el: (
          <button className="text-left" onClick={() => callback?.(id, data)}>
            You just made a sale, amazing! Here’s 20 $HSL 🎉
          </button>
        )
      }
    }
  }
}
/**
 * Notify user globally
 * @param user
 */
interface GlobalClientNotifyProps {
  callback?: (id: NotifyId, ...args: any) => void
  opts?: ToastOptions
}
export const GlobalClientNotify: React.FC<GlobalClientNotifyProps> = ({ callback, opts = {} }) => {
  const { me: user } = useMe()
  // get user new sales reward
  const { data: reward } = useClaimableReward(user?._id ? `newsales-${user._id}` : null)
  const activeNotifications = useHookstate(closedAlerts)

  const handleNotify = useCallback(() => {
    const ids: NotifyId[] = []
    const data: {
      [key: string]: any
    } = {}
    if (user?.noPassword && user?.email) {
      ids.push('no-password')
    } else {
      // remove from ids
      const index = ids.indexOf('no-password')
      if (index !== -1) ids.splice(index, 1)
      toast.dismiss('no-password')
    }

    // if there is a new sales reward
    if (reward?.data?.type === 'ok') {
      ids.push('new-sales')
      data['new-sales'] = reward?.data
    }
    // if there is no social connector email
    if (user && !user?.socialConnectorEmail) ids.push('no-social-connector')

    // show notifications
    ids.forEach((id) => {
      // if the user has closed the notification, don't notify
      if (activeNotifications.value.includes(id)) return

      const notify = notifies({ id, callback, data })
      const notifyType = notify?.type
      if (notifyType && notify.el) {
        // notify the user
        toast[notifyType](notify.el, { duration: Infinity, position: 'bottom-right', id, icon: notify.icon, ...opts })
      }
    })
  }, [user, activeNotifications.value, reward, callback, opts])

  useEffect(() => {
    handleNotify()
  }, [handleNotify])
  return <></>
}
