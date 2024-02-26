'use client'
import moment from 'moment'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Tooltip } from 'react-tooltip'
import useSWR from 'swr'

import { Alert } from '@/components/alerts/alert'
import { confirm } from '@/components/alerts/confirmation'
import { Loading } from '@/components/ui/button'
import { useMe } from '@/hooks/use-me'
import { getAchieves, isRewardClaimable } from '@/lib/goal-tracker-helper'
import { cn } from '@/lib/utils'
import { GET_GOAL_TRACKER_HISTORY } from '@/restapi/goal-tracker/constants'
import { claimGoalTrackerReward } from '@/restapi/goal-tracker/mutation'

import { DataTable } from '../'

export const GoalTrackerHistoryTable: React.FC = () => {
  const { me } = useMe()
  const { data: trackers, isLoading, mutate } = useSWR<RestApi.Response<GoalTracker.Entity[]>>(GET_GOAL_TRACKER_HISTORY)
  const [claiming, setClaiming] = useState<{
    [key: string]: boolean
  }>()

  const data = useMemo(() => {
    const result = trackers?.data?.map((tracker) => {
      const isReached = getAchieves(tracker)?.both
      return {
        _id: tracker?._id,
        date: tracker?.createdAt,
        type: tracker?.type,
        goals: tracker?.goals,
        sales: tracker?.achieved?.sales,
        calls: tracker?.achieved?.calls,
        status: isReached ? 'reached' : 'unreached',
        claimable: isRewardClaimable(tracker)
      }
    })
    return result
  }, [trackers])

  const handleClaimReward = async (tracker: GoalTracker.Entity, claimable = false) => {
    if (!claimable) return
    if (!me?.socialConnectorEmail) {
      toast.error('Add your SocialConnector email if you want to receive $HSL rewards for building your business.')
      return
    }
    setClaiming((prev) => ({ ...prev, [tracker?._id]: true }))
    const confirmation = await confirm('Are you sure you want to claim this reward?')
    if (!confirmation) return
    await claimGoalTrackerReward(tracker?._id)
      .then(() => {
        toast.success('Reward claimed successfully.')
        mutate()
      })
      .catch((error: any) => {
        toast.error(error?.message || 'Something went wrong, please try again later.')
      })
      .finally(() => {
        setClaiming((prev) => ({ ...prev, [tracker?._id]: false }))
      })
  }

  const columns = useMemo(() => {
    return [
      {
        Header: 'Date',
        accessor: 'date',
        Cell: (c: any) => {
          const row = c?.row?.original
          return <span>{moment.unix(row?.date).calendar()}</span>
        }
      },
      {
        Header: 'Type',
        accessor: 'type',
        Cell: (c: any) => {
          const row = c?.row?.original
          return (
            // <span className="capitalize flex space-x-1 items-center">
            //   {row?.type === 'calls' ? <MdCall /> : <MdOutlineBarChart />}
            //   {row?.type}
            // </span>
            <span
              className={cn(
                'py-1 px-3 rounded-md h-fit border text-sm font-semibold uppercase',
                row?.type === 'earn' ? 'border-secondary text-secondary' : 'border-red-500 text-red-500'
              )}>
              {row?.type}
            </span>
          )
        }
      },
      {
        Header: 'Goals',
        accessor: 'value',
        Cell: (c: any) => {
          const row = c?.row?.original
          return (
            <div className="flex flex-col">
              {row?.goals?.calls > 0 && (
                <span className="capitalize">
                  Calls {row?.calls}/{row?.goals?.calls}
                </span>
              )}
              {row?.goals?.sales > 0 && (
                <span className="capitalize">
                  Sales {row?.sales}/{row?.goals?.sales}
                </span>
              )}
            </div>
          )
        }
      },
      {
        Header: 'Status',
        accessor: 'status',
        width: 150,
        Cell: (c: any) => {
          const row = c?.row?.original
          return (
            <div>
              <button
                className={cn(
                  'px-2 py-1 rounded-lg font-medium text-sm text-white',
                  row?.status === 'reached' ? 'bg-primary' : 'bg-red-600'
                )}>
                <span className="capitalize text-xs">{row?.status}</span>
              </button>
            </div>
          )
        }
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        width: 150,
        Cell: (c: any) => {
          const row = c?.row?.original
          return (
            <div>
              <button
                className="px-2 py-1 rounded-lg font-medium text-sm border border-primary text-primary disabled:opacity-50 flex items-center space-x-2"
                data-tooltip-content={!row?.claimable?.claimable ? row?.claimable?.reason : ''}
                data-tooltip-id="not-claimable-reward"
                disabled={!row?.claimable?.claimable || claiming?.[row?._id]}
                onClick={() => handleClaimReward(row, row?.claimable?.claimable)}>
                {claiming?.[row?._id] && <Loading />}
                <span className="capitalize text-xs">Claim Reward</span>
              </button>
            </div>
          )
        }
      }
    ]
  }, [me, claiming])

  if (isLoading) {
    return (
      <div className="min-h-8rem flex items-center justify-center">
        <Loading />
      </div>
    )
  }
  if (!data || data?.length === 0) {
    return <Alert title="No data yet." />
  }
  return (
    <div className="max-h-md overflow-y-auto">
      <DataTable columns={columns} data={data} limitOptions={[5, 10, 15, 20]} totalData={0} />
      <Tooltip id="not-claimable-reward" />
    </div>
  )
}
