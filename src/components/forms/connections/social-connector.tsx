import { Formik } from 'formik'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { MdCheckCircle, MdError, MdInfoOutline } from 'react-icons/md'

import { Alert, AlertProps } from '@/components/alerts/alert'
import { Button } from '@/components/ui'
import { Loading } from '@/components/ui/button'
import { Input } from '@/components/ui/forms'
import { useMe } from '@/hooks/use-me'
import { useClaimableReward } from '@/hooks/use-rewards'
import { claimReward } from '@/restapi/rewards/mutation'
import { editUser } from '@/restapi/users/mutation'

export const SocialConnectorConnect = () => {
  const { me, isLoading, mutate } = useMe()
  const [claimLoading, setClaimLoading] = useState(false)
  const { isClaimable, data, mutate: mutateClaimable } = useClaimableReward('social-connector')

  const alertProps = useMemo(() => {
    if (!me?.socialConnectorEmail) {
      return {
        variant: 'warning',
        title: 'SocialConnector email not connnected',
        description:
          'Add your SocialConnector email if you want to receive $HSL rewards for building your business. If you don’t have an account, you’ll get an email with instructions.',
        icon: <MdError />
      } as AlertProps
    } else {
      return {
        variant: 'success',
        title: 'SocialConnector',
        description: (
          <div>
            <span>Your SocialConnector account is connected. You will receive $HSL rewards for building your business.</span>
          </div>
        ),
        icon: <MdCheckCircle />
      } as AlertProps
    }
  }, [me?.socialConnectorEmail])

  const handleClaimReward = async () => {
    setClaimLoading(true)
    try {
      await claimReward('social-connector').then(() => {
        mutateClaimable?.()
        toast.success('Reward claimed successfully.')
      })
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong, please try again later.')
    } finally {
      setClaimLoading(false)
    }
  }
  const handleSocialConnectorConnect = async (values?: Record<string, any>) => {
    if (!me?._id) {
      toast.error('You need to login first')
      return
    }
    try {
      await editUser(me?._id, {
        socialConnectorEmail: values?.socialConnectorEmail,
        socialConnectorAddress: values?.socialConnectorAddress
      })
      mutate?.()
      toast.success('Social connector added successfully.')
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong, please try again later.')
    }
  }

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
      {isClaimable && (
        <Alert
          variant="info"
          icon={<MdInfoOutline />}
          title={`Claim your ${data?.data?.reward?.amount} $HSL now.`}
          description={
            <>
              <span>Claim your $HSL reward for connecting your SocialConnector account.</span>
              <Button
                size="sm"
                variant="secondary"
                className="py-1 mt-2"
                rounded="lg"
                onClick={handleClaimReward}
                loading={claimLoading}>
                Claim
              </Button>
            </>
          }
        />
      )}
      <Formik
        initialValues={{
          socialConnectorEmail: me?.socialConnectorEmail || '',
          socialConnectorAddress: me?.socialConnectorAddress || ''
        }}
        onSubmit={handleSocialConnectorConnect}
        enableReinitialize>
        {({ values, handleChange, handleBlur, handleSubmit, errors, isSubmitting }) => (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-3 lg:space-y-3">
            <Input
              label="SocialConnector Email"
              placeholder="john.doe@gmail.com"
              type="email"
              name="socialConnectorEmail"
              size="sm"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.socialConnectorEmail}
              error={errors?.socialConnectorEmail}
              required
            />
            <Input
              label="SocialConnector Address"
              placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
              type="address"
              name="socialConnectorAddress"
              size="sm"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.socialConnectorAddress}
              error={errors?.socialConnectorAddress}
              required
            />
            <div>
              <div className="flex space-x-3 lg:space-x-5 mt-3">
                <Button type="submit" size="sm" loading={isSubmitting}>
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  )
}
