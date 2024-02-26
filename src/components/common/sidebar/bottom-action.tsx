'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui'
import { useMe } from '@/hooks/use-me'
import { verifyPermissions } from '@/lib/verify-permissions'

import { ConnectWallet } from '../connect-button'
import { AddDiscordConnectModal } from '../modals/discord/connect'

interface BottomActionProps {
  permissions?: string[]
}
export const BottomAction: React.FC<BottomActionProps> = ({ permissions }) => {
  const [discordConnectModal, setDiscordConnectModal] = useState(false)
  const pathname = usePathname()
  const { me } = useMe()

  return (
    <div className="divide-y divide-gray-700 flex flex-col space-y-3">
      <div className="flex flex-col space-y-3 px-5">
        {verifyPermissions('/settings/connections', permissions, true) && (
          <Button
            url="/settings/connections/stripe"
            size="sm"
            variant={pathname?.startsWith('/settings/connections') ? 'primary' : 'outline'}
            rounded="xl"
            className="text-lg py-1">
            Connections
          </Button>
        )}

        {me?.role && me?.role !== 'member' && (
          <Button
            url="/settings/team"
            size="sm"
            variant={pathname?.startsWith('/settings/team') ? 'primary' : 'outline'}
            rounded="xl"
            className="text-lg py-1">
            Team
          </Button>
        )}
        {verifyPermissions('/autopilot', permissions, true) && (
          <Button
            url="/autopilot"
            size="sm"
            variant={pathname?.startsWith('/autopilot') ? 'primary' : 'outline'}
            rounded="xl"
            className="text-lg py-1">
            Auto Pilot
          </Button>
        )}
      </div>
      <div className="pt-3 px-5">
        <ConnectWallet
          dropdownPosition="top"
          showDiscordConnect={me?.role !== 'member'}
          showProfileButton
          onDiscordConnectClick={setDiscordConnectModal}
        />
      </div>
      <AddDiscordConnectModal show={discordConnectModal} onClose={() => setDiscordConnectModal(false)} />
    </div>
  )
}
