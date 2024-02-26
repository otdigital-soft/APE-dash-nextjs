'use client'
import moment from 'moment'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

import { Alert } from '@/components/alerts/alert'
import { Loading } from '@/components/ui/button'
import { useMe } from '@/hooks/use-me'
import { GET_GOAL_TRACKER_HISTORY } from '@/restapi/goal-tracker/constants'

import { DataTable } from '../'
import { useNotifications } from '@/hooks/use-notifications'

export const NotificationHistoryTable: React.FC = () => {
  const { me } = useMe()
  const { data: trackers, isLoading, mutate } = useSWR<RestApi.Response<GoalTracker.Entity[]>>(GET_GOAL_TRACKER_HISTORY)
  const [claiming, setClaiming] = useState<{
    [key: string]: boolean
  }>()

  const { allNotifications, readNotification } = useNotifications()

  const data = useMemo(() => {
    const result = allNotifications.map((notification) => {
      return {
        _id: notification?._id,
        date: notification?.createdAt,
        type: notification?.type,
        content: notification?.content,
        title: notification?.title,
        status: notification?.status
      }
    })
    return result
  }, [allNotifications])

  const columns = useMemo(() => {
    return [
      {
        Header: 'Title',
        accessor: 'title',
        Cell: (c: any) => {
          const row = c?.row?.original
          return <span>{row?.title}</span>
        }
      },
      {
        Header: 'Content',
        accessor: 'content',
        Cell: (c: any) => {
          const row = c?.row?.original
          return <span>{row?.content}</span>
        }
      },
      {
        Header: 'Date',
        accessor: 'date',
        Cell: (c: any) => {
          const row = c?.row?.original
          return (
            <div className="flex flex-col">
              <span className="capitalize">{new Date(row.date).toDateString()}</span>
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
              <span className="capitalize text-xs">{row?.status ? 'Viewd' : 'Pending'}</span>
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
                data-tooltip-id="not-claimable-reward"
                disabled={row.status}
                onClick={() => readNotification(row._id)}>
                {claiming?.[row?._id] && <Loading />}
                <span className="capitalize text-xs">{row.status ? 'Read' : 'Mark as Read'}</span>
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
    </div>
  )
}
