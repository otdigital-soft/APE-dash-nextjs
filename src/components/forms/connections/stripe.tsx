import { useMemo } from 'react'
import { FiExternalLink } from 'react-icons/fi'
import { MdCheckCircle, MdError } from 'react-icons/md'

import { Alert, AlertProps } from '@/components/alerts/alert'
import { Button } from '@/components/ui'
import { Loading } from '@/components/ui/button'
import { useMe, useStripeIANConnection } from '@/hooks/use-me'

export const StripeConnect = () => {
  const { me, isLoading } = useMe()
  const { data } = useStripeIANConnection()

  const alertProps = useMemo(() => {
    if (!data?.data?.isConnected) {
      return {
        variant: 'danger',
        title: 'Stripe account not connected',
        description: 'Please connect your stripe account in InstantAppNow to continue.',
        icon: <MdError />
      } as AlertProps
    } else {
      return {
        variant: 'success',
        title: 'Stripe account connected',
        description: (
          <span>
            Your stripe account is connected in{' '}
            <a href={me?.productUrl} className="underline" target="_blank">
              InstantAppNow
            </a>{' '}
            with account ID <span className="font-bold">{data?.data?.stripeAccountId}</span>.
          </span>
        ),
        icon: <MdCheckCircle />
      } as AlertProps
    }
  }, [data?.data, me?.productUrl])

  if (isLoading) {
    return (
      <div className="min-h-8rem flex flex-col items-center justify-center">
        <Loading />
      </div>
    )
  }
  return (
    <div className="flex flex-col space-y-4">
      {alertProps && <Alert {...alertProps} />}
      <div className="flex space-x-3">
        <Button size="sm" variant="secondary" className="space-x-2" url={me?.productUrl} external>
          <FiExternalLink />
          <span>Open InstantAppNow</span>
        </Button>
      </div>
    </div>
  )
}
