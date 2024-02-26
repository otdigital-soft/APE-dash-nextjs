'use client'

import QueryString from 'qs'
// import QueryString from 'qs'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

import { LeaderboardTable } from '@/components/common/datatable/leaderboard'
import { Leaderboard } from '@/components/common/leaderboard'
import { Loading } from '@/components/ui/button'
import { GET_LEADERBOARD } from '@/restapi/leaderboard/constants'
import { Leaderboard as LeaderboardInterface } from '@/restapi/leaderboard/leaderboard'

export default function LeaderboardPage() {
  const [query] = useState<Record<string, any>>()
  const { data, isLoading } = useSWR<RestApi.Response<LeaderboardInterface[]>>(
    GET_LEADERBOARD + '?' + QueryString.stringify(query)
  )
  // const [filter, setFilter] = useState<'revenue' | 'influence' | 'leads'>('revenue')

  // const handleFilter = (value: 'revenue' | 'influence' | 'leads') => {
  //   setFilter(value)
  //   switch (value) {
  //     case 'influence':
  //       setQuery({
  //         ...query,
  //         page: 1,
  //         sort: {
  //           influence: -1
  //         }
  //       })
  //       break
  //     case 'leads':
  //       setQuery({
  //         ...query,
  //         page: 1,
  //         sort: {
  //           leads: -1
  //         }
  //       })
  //       break
  //     default:
  //       setQuery({
  //         ...query,
  //         page: 1,
  //         sort: {
  //           revenue: -1
  //         }
  //       })
  //       break
  //   }
  // }

  const top3 = useMemo(() => {
    if (!data?.data) return []
    const clone = [...data.data]
    return clone?.sort((a, b) => (b.revenue || 0) - (a.revenue || 0)).slice(0, 3)
  }, [data])

  return (
    <main className="my-5 flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-5">
      <h1 className="block lg:hidden text-3xl mb-5">Leaderboard</h1>

      {isLoading && (
        <div className="flex items-center justify-center h-70vh w-full">
          <Loading />
        </div>
      )}
      {!isLoading && (
        <>
          <div className="lg:w-4/12">
            <Leaderboard data={top3} />
          </div>
          <div className="lg:w-8-/12">
            <LeaderboardTable data={data?.data} />
          </div>
        </>
      )}
    </main>
  )
}
