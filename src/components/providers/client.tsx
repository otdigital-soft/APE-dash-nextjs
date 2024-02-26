'use client'
import { SessionProvider } from 'next-auth/react'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { SWRConfig } from 'swr'

import { usePrivateRss } from '@/hooks/use-private-rss'
import { claimReward } from '@/restapi/rewards/mutation'
import api from '@/services/api'
import { fetcher } from '@/services/fetcher'
import { setClosedAlert } from '@/stores/global-notify'

import { GlobalClientNotify, NotifyId } from '../alerts/global-notify'
import { ChangePasswordModal } from '../common/modals/change-password'
import { ShareSalesModal } from '../common/modals/share/sales'
import { Toast } from './toast'

interface ClientProviderProps {
  jwt?: string
  children: React.ReactNode
  withAuth?: boolean
}
export const ClientProvider: React.FC<ClientProviderProps> = ({ jwt, children, withAuth = true }) => {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [showSalesModal, setShowSalesModal] = useState(false)
  const { token, requiresAuth: isExpired } = usePrivateRss()

  if (jwt && withAuth) {
    api.defaults.headers.Authorization = `Bearer ${jwt}`
  }

  if (token) {
    if (!isExpired()) {
      api.defaults.headers['x-authorize-token'] = token
    }
  }

  const handleNotifyCallback = async (id: NotifyId, data?: any) => {
    switch (id) {
      case 'no-password':
        setShowChangePasswordModal(true)
        break
      case 'new-sales': {
        const rewardName = data?.[id]?.reward?.name
        // console.log(rewardName)
        if (!rewardName) return
        toast.loading('You just made a sale, amazing! Here’s 20 $HSL 🎉', { id })
        await claimReward(rewardName)
          .then(() => {
            toast.success('Reward claimed!', { id })
            setShowSalesModal(true)
          })
          .catch(() => {
            toast.error('Failed to claim reward', { id })
          })
          .finally(() => {
            // delay 1s to close the toast
            setTimeout(() => {
              toast.dismiss(id)
              setClosedAlert(id)
            }, 5000)
          })
        break
      }
      default:
        toast.dismiss(id)
        setClosedAlert(id)
        break
    }
  }

  const render = useCallback(
    (loggedIn?: boolean) => {
      return (
        <SWRConfig
          value={{
            revalidateOnFocus: false,
            refreshInterval: 0,
            fetcher
          }}>
          {children}
          <Toast />
          <ProgressBar height="3px" color="#CD9D43" options={{ showSpinner: false }} shallowRouting />
          {loggedIn && (
            <>
              <ChangePasswordModal show={showChangePasswordModal} onClose={() => setShowChangePasswordModal(false)} />
              <ShareSalesModal show={showSalesModal} onClose={() => setShowSalesModal(false)} />
              <GlobalClientNotify callback={handleNotifyCallback} />
            </>
          )}
        </SWRConfig>
      )
    },
    [children, showChangePasswordModal, showSalesModal]
  )

  if (withAuth) {
    return <SessionProvider>{render(!!jwt)}</SessionProvider>
  }

  return render()
}
