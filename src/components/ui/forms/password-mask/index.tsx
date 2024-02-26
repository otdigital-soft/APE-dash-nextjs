'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useCopyToClipboard } from 'react-use'
import { mutate } from 'swr'

import { CopyIcon, EyeIcon, EyeOffIcon } from '@/components/common'
import { RequireAuthModal } from '@/components/common/modals/require-auth'
import { useMe } from '@/hooks/use-me'
import { usePrivateRss } from '@/hooks/use-private-rss'
import { GET_ALL_ACCOUNT } from '@/restapi/accounts/constants'
import api from '@/services/api'

interface PasswordMaskProps {
  password: string
}
export const PasswordMask: React.FC<PasswordMaskProps> = ({ password }) => {
  const [hidden, setHidden] = useState(true)
  const [showRequireAuthModal, setShowRequireAuthModal] = useState(false)
  const [, copyToClipboard] = useCopyToClipboard()
  const { requiresAuth, getToken } = usePrivateRss()
  const { me } = useMe()

  const handleCopy = () => {
    if (requiresAuth()) {
      if (me?.noPassword) {
        toast.error('You need to add password in order to access this resources.', {
          position: 'top-center'
        })
        return
      }
      setShowRequireAuthModal(true)
      return
    }
    toast.success('Password copied to clipboard.')
    copyToClipboard(password)
  }

  const handleToggle = (state: boolean) => {
    // check if it's required to be authenticated
    if (requiresAuth() && state === false) {
      if (me?.noPassword) {
        toast.error('You need to add password in order to access this resources.', {
          position: 'top-center'
        })
        return
      }
      console.log(me)
      setShowRequireAuthModal(true)
      return
    }
    setHidden(!hidden)
  }

  const handleAuthSuccess = () => {
    setHidden(false)
    setShowRequireAuthModal(false)
    // append token to
    api.defaults.headers['x-authorize-token'] = getToken()
    // mutate data
    mutate(GET_ALL_ACCOUNT)
  }

  return (
    <div className="inline-flex items-center bg-dark rounded-2xl py-2 lg:py-3 space-x-3 px-5 justify-content-between">
      <div className="flex space-x-2 items-center h-5">
        {hidden && (
          <>
            {[...Array(6)].map((_, i) => (
              <svg key={i} width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="3.5" cy="4" r="3.5" fill="#3A3A3A" />
              </svg>
            ))}
          </>
        )}
        {!hidden && <span className="text-sm">{password}</span>}
      </div>
      <button onClick={() => handleToggle(!hidden)}>{hidden ? <EyeOffIcon /> : <EyeIcon size={18} />}</button>
      <button onClick={handleCopy}>
        <CopyIcon />
      </button>
      {requiresAuth() && (
        <RequireAuthModal
          show={showRequireAuthModal}
          onClose={() => setShowRequireAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  )
}
