'use client'
import Cookies from 'js-cookie'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { BsDiscord } from 'react-icons/bs'
import { MdLogout, MdManageAccounts } from 'react-icons/md'

import { Button } from '@/components/ui'
import { Loading } from '@/components/ui/button'
import { PRIVATE_RSS_COOKIE_NAME } from '@/constants/app'
import { useMe } from '@/hooks/use-me'
import { connectWallet } from '@/services/wallet'

import { Avatar } from '../avatar'
import { Dropdown } from '../dropdown'

interface ConnectWalletProps {
  dropdownPosition?: 'top' | 'bottom'
  showDiscordConnect?: boolean
  showProfileButton?: boolean
  onDiscordConnectClick?: (state: boolean) => void
}
export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  dropdownPosition = 'bottom',
  showDiscordConnect,
  showProfileButton,
  onDiscordConnectClick
}) => {
  const { status } = useSession()
  const { push } = useRouter()
  const { me } = useMe({}, status === 'authenticated')

  async function signIn() {
    if (status === 'loading') return
    const result = await connectWallet()
    if (result?.error) {
      toast('Error: ' + result?.error)
      return
    }
    if (result?.url !== null && result?.url !== undefined) {
      window.location.href = result?.url
    } else {
      window.location.href = '/'
    }
  }

  const handleSignOut = async () => {
    Cookies.remove(PRIVATE_RSS_COOKIE_NAME)
    signOut({
      redirect: true
    })
  }

  const render = useCallback(() => {
    if (status === 'authenticated') {
      return (
        <>
          <Dropdown
            dropdownClass="w-60"
            direction={dropdownPosition}
            el={
              <Avatar
                name={
                  <span className="flex flex-col leading-3">
                    <span>{me?.name || me?.nftId || ''}</span>
                    {me?.role === 'member' && (
                      <span className="text-xs text-left text-gray-300">{me?.team?.owner?.name}&apos;s member</span>
                    )}
                  </span>
                }
              />
            }>
            <div className="flex flex-col space-y-1 py-1">
              {showDiscordConnect && (
                <button
                  className="py-2 px-5 hover:bg-dark-gray text-left flex items-center space-x-2"
                  onClick={() => onDiscordConnectClick?.(true)}>
                  <BsDiscord />
                  <span>Discord Username</span>
                </button>
              )}
              {showProfileButton && (
                <button
                  className="py-2 px-5 hover:bg-dark-gray text-left flex items-center space-x-2"
                  onClick={() => push('/settings/manage/profile')}>
                  <MdManageAccounts />
                  <span>Profile</span>
                </button>
              )}

              <button
                className="py-2 px-5 hover:bg-dark-gray text-left flex items-center space-x-2"
                onClick={() => handleSignOut()}>
                <MdLogout />
                <span>Logout</span>
              </button>
            </div>
          </Dropdown>
        </>
      )
    } else {
      return (
        <Button
          className="flex items-center py-2 space-x-3 w-full transition-all hover:bg-primary"
          variant="outline"
          rounded="xl"
          onClick={signIn}>
          <Image src="/static/icons/metamask_logo.svg" width={25} height={25} alt="metamask_logo" />
          {status === 'loading' ? (
            <div className="flex items-center justify-center text-white px-3">
              <Loading />
            </div>
          ) : (
            <span>Connect Wallet</span>
          )}
        </Button>
      )
    }
  }, [status, me, dropdownPosition, onDiscordConnectClick, showDiscordConnect])
  return <>{render()}</>
}
