'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { MdCheckCircle } from 'react-icons/md'
import { RiInstagramFill, RiTwitterXFill } from 'react-icons/ri'
import useSWR from 'swr'

import Button, { Loading } from '@/components/ui/button'
import { GET_STRIPE_CUSTOMERS } from '@/restapi/finances/constants'
import { claimSalesReward } from '@/restapi/rewards/mutation'

import { Modal, ModalProps } from '../'

interface ShareSalesModalProps extends ModalProps {
  onSuccess?: (data: any) => void
}

export const ShareSalesModal: React.FC<ShareSalesModalProps> = ({ onClose, show, ...props }) => {
  const { data, isLoading } = useSWR(GET_STRIPE_CUSTOMERS + '?simple=true')
  const [claiming, setClaiming] = useState(false)
  const [shared, setShared] = useState({
    twitter: false,
    instagram: false
  })
  const handleShare = (type: 'twitter' | 'instagram') => {
    switch (type) {
      case 'twitter': {
        // share on twitter, open a new window, detect if the user has shared
        const url = `https://twitter.com/intent/tweet?text=I just sold a customer for my own SAAS business! I now have ${data?.data?.totalCustomers} customers paying me monthly. @jonathanbodnar`
        window.open(url, '_blank')
        setShared({
          ...shared,
          twitter: true
        })
        break
      }
      case 'instagram': {
        // share on instagram, open a new window, detect if the user has shared
        const url = 'https://www.instagram.com/'
        window.open(url, '_blank')
        setShared({
          ...shared,
          instagram: true
        })
        break
      }
      default:
        break
    }
  }

  const handleClaimSalesReward = async () => {
    setClaiming(true)
    await claimSalesReward()
      .then(() => {
        toast.success('Share reward claimed!')
        onClose?.()
      })
      .catch(() => {
        toast.error('Failed to claim reward')
      })
      .finally(() => {
        setClaiming(false)
      })
  }

  // useEffect(() => {
  //   if (shared.twitter && shared.instagram) {
  //     onSuccess?.()
  //     onClose?.()
  //   }
  // }, [shared, onClose, onSuccess])
  return (
    <Modal show={show} onClose={onClose} {...props}>
      <div className="my-5">
        <h1 className="text-2xl font-semibold text-center">
          Share your sale on Instagram or Twitter <br /> to earn another 5 $HSL
        </h1>
        {isLoading && (
          <div className="min-h-8rem flex items-center justify-center">
            <Loading />
          </div>
        )}
        {!isLoading && (
          <div className="flex items-center justify-center space-x-3 mt-5">
            <div className="relative">
              <button
                className="flex space-x-2 items-center rounded-lg px-4 py-1.5 bg-black disabled:opacity:50"
                onClick={() => handleShare('twitter')}
                disabled={shared.twitter}>
                <RiTwitterXFill />
                <span>Twitter</span>
              </button>
              {shared?.twitter && <MdCheckCircle className="absolute -top-1.5 -right-1.5 text-green-400" />}
            </div>
            <div className="relative">
              <button
                className="flex space-x-2 items-center rounded-lg px-4 py-1.5 bg-#0095f6 disabled:opacity-50"
                onClick={() => handleShare('instagram')}
                disabled={shared.instagram}>
                <RiInstagramFill />
                <span>Instagram</span>
              </button>
              {shared?.instagram && <MdCheckCircle className="absolute -top-1.5 -right-1.5 text-green-400" />}
            </div>
          </div>
        )}
        {shared?.instagram && shared?.twitter && (
          <Button
            className="mx-auto mt-8 border-secondary"
            variant="outline"
            onClick={handleClaimSalesReward}
            loading={claiming}
            disabled={claiming}>
            🔥 Claim Reward
          </Button>
        )}
      </div>
    </Modal>
  )
}
