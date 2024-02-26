'use client'
import { useMemo } from 'react'

import { toCurrency } from '@/lib/utils'
import { Leaderboard as LeaderboardInterface } from '@/restapi/leaderboard/leaderboard'

import { DataTable } from '../'
import { Avatar } from '../../avatar'

// const data = [...Array(15)].map((_, i) => ({
//   rank: i + 1,
//   company: faker.company.name(),
//   active_customers: 200,
//   revenue: 23778,
//   influence: 45778
// }))

interface LeaderboardTableProps {
  data?: LeaderboardInterface[]
}
export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ data }) => {
  const columns = useMemo(() => {
    return [
      {
        Header: 'Rank',
        accessor: 'rank',
        width: 60,
        Cell: (c: any) => {
          return <span>{Number(c?.row?.id) + 1}</span>
        }
      },
      {
        Header: 'Company',
        accessor: 'company',
        width: '40%',
        Cell: (c: any) => {
          const row = c?.row?.original
          return (
            <div className="flex items-center space-x-2">
              <Avatar name={row?.company?.name || row?.user?.name} size="sm" provider="ui-avatar" />
            </div>
          )
        }
      },
      {
        Header: 'Active Customer',
        accessor: 'activeCustomers',
        Cell: (c: any) => {
          const row = c?.row?.original
          return <span>{row?.activeCustomers || 0}</span>
        }
      },
      {
        Header: 'Revenue',
        accessor: 'revenue',
        Cell: (c: any) => {
          const row = c?.row?.original
          return <span>{toCurrency(row?.revenue || 0, true)}</span>
        }
      }
      // {
      //   Header: 'Influence',
      //   accessor: 'influence'
      // }
    ]
  }, [])
  return <DataTable columns={columns} data={data || []} className="min-h-500px" />
}
