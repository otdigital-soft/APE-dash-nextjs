'use client'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { MdClose, MdMenu } from 'react-icons/md'

import { confirm } from '@/components/alerts/confirmation'
import { Button } from '@/components/ui'
import { useBusinessNfts } from '@/hooks/use-business-nfts'
import { usePermission } from '@/hooks/use-me'
import { useBalance } from '@/hooks/use-sol-balance'
import { cn, cutString } from '@/lib/utils'
import { menuState } from '@/stores/menu'
import { useHookstate } from '@hookstate/core'

import { Dropdown } from '../dropdown'
import { HuslIcon } from '../icons'
import { Notification } from '../notifications'

interface NavbarProps {
  full?: boolean
  containerClassname?: string
  showLogo?: boolean
  hideNftSelector?: boolean
}
export const Navbar: React.FC<NavbarProps> = ({ full, containerClassname, showLogo, hideNftSelector }) => {
  const { data, status } = useSession()
  const menuType = useHookstate(menuState)
  const { nfts, address } = useBusinessNfts(data?.user?.nftId)
  const { huslBalance } = useBalance()

  const canSwitchNftAccount = usePermission('switch-nft-accounts')

  const handleMenuType = () => {
    menuState.set(menuType.value === 'full' ? 'collapsed' : 'full')
  }
  const handleLoginByNFT = async (nftId?: string) => {
    if (!nftId) return toast.error('NFT ID is not valid')
    try {
      const confirmation = await confirm('Are you sure you want to sign in with this NFT?')
      if (!confirmation) return
      await signIn('user', {
        nftId: nftId
      })
    } catch (error: any) {
      toast.error(error)
    }
  }
  return (
    <nav
      className={cn(
        'bg-dark-gray z-50 lg:bg-dark px-6 py-3 fixed top-0 border-b border-stoke w-full bg-opacity-90 backdrop-filter backdrop-blur'
      )}
      style={{
        width: full ? '100% !important' : ''
      }}>
      <div className={cn('flex items-center justify-between flex-wrap lg:w-[calc(100%-240px)]', containerClassname)}>
        {/* Mobile Logo */}
        <Link href="/" className={cn('block', showLogo ? 'block' : 'lg:hidden')}>
          <Image src="/static/images/logo.svg" alt="logo" width={64} height={32} />
        </Link>
        <div>
          {!hideNftSelector && canSwitchNftAccount && (
            <Dropdown
              el={
                <Button
                  text={data?.user?.name}
                  variant="none"
                  className={cn('!bg-dark lg:!bg-dark-gray', nfts?.length !== 0 && 'pr-10')}
                  size="sm"
                  loading={status === 'loading'}
                />
              }
              containerClass="text-white"
              chevronClass="right-2"
              variant="dark-gray"
              hideCarret
              hideMenu={nfts?.length === 0}>
              <div className="flex flex-col space-y-1 py-1 ">
                {nfts?.map((nft, i) => (
                  <button key={i} className="py-2 px-5 hover:bg-dark text-left" onClick={() => handleLoginByNFT(nft?.nftId)}>
                    {nft?.name || nft?.nftId}
                  </button>
                ))}
              </div>
            </Dropdown>
          )}
        </div>

        <div className="hidden lg:flex items-center space-x-3">
          <Notification />
          <Button rounded="full" variant="dark-gray" className="flex items-center space-x-3">
            <HuslIcon />
            <span>
              {((huslBalance || 0) / 1e9).toFixed(2)} {cutString(address || '', 5, 5)}
            </span>
          </Button>
        </div>
        {/* Mobile menu */}
        <button
          className="w-8 h-8 flex lg:hidden items-center justify-center rounded-full bg-primary"
          onClick={handleMenuType}>
          {menuType.value === 'full' ? <MdClose /> : <MdMenu />}
        </button>
      </div>
    </nav>
  )
}
