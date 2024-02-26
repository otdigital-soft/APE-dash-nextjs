'use client'
import { Formik } from 'formik'
import { useMemo, useState, Fragment } from 'react'
import toast from 'react-hot-toast'
import { MdSave } from 'react-icons/md'

import { confirm } from '@/components/alerts/confirmation'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui/forms'
import { Tooltip } from '@/components/ui/tooltips'
import { TRACKER_CALLS_REWARD_PER_UNIT, TRACKER_SALES_REWARD_PER_UNIT } from '@/constants/app'
import { useRingCentral } from '@/hooks/use-ringcentral'

import { useBalance } from '@/hooks/use-sol-balance'

import { cn } from '@/lib/utils'
import { createGoalTracker } from '@/restapi/goal-tracker/mutation'

import { goalTrackerSchema } from './schema'
import { AccessAccountModal } from '@/components/common/modals/access-account'
import { getSocialConnectorAccountToken } from '@/restapi/access-token/mutation'
import { useMe } from '@/hooks/use-me'

const typeOptions = [
  {
    title: 'earn',
    description: 'You will earn $HSL once you reach your goal.'
  },
  {
    title: 'bet',
    description: 'Bet your $HSL and earn doubles.'
  }
] as const

interface GoalTrackerFormProps {
  onSetGoalTracker?: () => void
  disabled?: boolean
}

export const GoalTrackerForm: React.FC<GoalTrackerFormProps> = ({ onSetGoalTracker, disabled }) => {
  const [type, setType] = useState<'earn' | 'bet'>('earn')

  const [modalShow, setModalShow] = useState(false)
  const [accountPassword, setAccountPassword] = useState('')
  const [accountToken, setAccountToken] = useState('')

  const { solBalance, huslBalance } = useBalance()
  const { openAuthWindow, isAvailable } = useRingCentral()
  const { me } = useMe()

  const handleGetTokenFromAccount = async () => {
    const account = await getSocialConnectorAccountToken({
      email: me?.socialConnectorEmail,
      password: accountPassword
    })
    setAccountToken(account?.data?.token)
    setModalShow(false)

    const confirmation = await confirm(`Are you sure you want to bet ${rewards} HSL?`, 'Proceed', 'Cancel', {
      title: 'Bet Goal Tracker?'
    })

    if (confirmation) return
    else return
  }

  const calcReward = (values: GoalTracker.CreateDto) => {
    return Number(((values?.sales || 0) * rewards?.sales + (values?.calls || 0) * rewards?.calls).toFixed(2))
  }
  const onSubmit = async (values: GoalTracker.CreateDto) => {
    // check if either calls or sales is not set
    if (!values?.calls && !values?.sales) {
      toast.error('Please set either calls or sales.')
      return
    }
    const reward = calcReward(values)
    if (type === 'bet') {
      setModalShow(true)
      // if (huslBalance < reward) {
      //   toast.error(`Unsifficient balance, make sure you have ${reward} in your SC wallet to bet.`)
      //   return
      // }
    }

    if (type !== 'bet') {
      const confirmation = await confirm(
        'Are you sure you want to set goal tracker? Goal tracker will be available and resets after 12 hours.',
        'Proceed',
        'Cancel',
        {
          title: 'Set Goal Tracker?'
        }
      )
      if (!confirmation) return
    }

    try {
      // append type
      values.type = 'earn'
      await createGoalTracker(values)
      toast.success('Goal tracker has been set.')
      onSetGoalTracker?.()
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong, please try again later.')
    }
  }

  const values = useMemo(() => {
    return {
      calls: 0,
      sales: 0
    }
  }, [])

  const rewards = useMemo(() => {
    const calls = TRACKER_CALLS_REWARD_PER_UNIT
    const sales = TRACKER_SALES_REWARD_PER_UNIT
    // if (type === 'bet') {
    //   calls *= 2
    //   sales *= 2
    // }
    return {
      calls,
      sales
    }
  }, [])

  return (
    <div>
      <span className="block mb-4">
        <h2 className="text-xl font-bold">What’s your goal today?</h2>
        <p className="text-sm text-gray-300">
          Set your goal to earn $HSL. Tracker will be available and resets after 12 hours.
        </p>
      </span>
      <Formik initialValues={values} validationSchema={goalTrackerSchema} onSubmit={onSubmit} enableReinitialize>
        {({ values, handleChange, handleBlur, handleSubmit, errors, isSubmitting }) => (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-3 lg:space-y-3">
            <span className="isolate flex rounded-md shadow-sm">
              {typeOptions.map((item, i) => (
                <Fragment key={i}>
                  <button
                    data-tooltip-id="earn-bet-tooltip"
                    data-tooltip-content={item.description}
                    type="button"
                    className={cn(
                      'relative inline-flex flex-1 capitalize items-center first:rounded-l-lg last:rounded-r-lg hover:opacity-80 transition-opacity px-3 py-1.5 text-sm font-semibold border-primary border-1.5 justify-center',
                      type === item.title && '!bg-primary'
                    )}
                    onClick={() => setType(item.title)}>
                    {item.title}
                  </button>
                </Fragment>
              ))}
            </span>
            <Input
              label={`Make Calls`}
              size="sm"
              type="number"
              name="calls"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.calls}
              error={errors?.calls}
              disabled={!isAvailable}
              hint={
                <div className="flex flex-col">
                  <span className="text-white">{rewards.calls} $HSL per call</span>
                  {!isAvailable && (
                    <span className="text-sm">
                      Connect RingCentral to track calls.{' '}
                      <button type="button" className="underline text-primary" onClick={openAuthWindow}>
                        Connect
                      </button>
                    </span>
                  )}
                </div>
              }
            />
            <Input
              label="Make Sales"
              size="sm"
              type="number"
              name="sales"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.sales}
              error={errors?.sales}
              hint={
                <div className="flex flex-col">
                  <span className="text-white">{rewards.sales} $HSL per sale</span>
                </div>
              }
            />
            <AccessAccountModal
              show={modalShow}
              onClose={() => setModalShow(false)}
              onChangeInput={setAccountPassword}
              onConfirm={handleGetTokenFromAccount}
            />
            <div className="flex space-x-3 items-center">
              <Button
                type="submit"
                variant="outline"
                className="border-primary items-center space-x-1 disabled:opacity-50"
                size="sm"
                loading={isSubmitting}
                disabled={disabled}>
                {!isSubmitting && <MdSave />}
                <span>Set Goal Tracker</span>
              </Button>
              {(values?.sales !== 0 || values?.calls !== 0) && (
                <span className="text-xs">
                  <p>Expected Rewards:</p>
                  <p>{calcReward(values)} $HSL</p>
                </span>
              )}
            </div>
          </form>
        )}
      </Formik>
      <Tooltip id="earn-bet-tooltip" />
    </div>
  )
}
