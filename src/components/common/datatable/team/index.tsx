'use client'
import moment from 'moment-timezone'
import { useMemo } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'

import { siteConfig } from '@/constants/config'
import { User } from '@/restapi/users/user'

import { DataTable } from '../'

interface TeamTableProps {
  owner?: User.Entity
  data?: User.Entity[]
  onEditRowClick?: (data: User.Entity) => void
  onDeleteRowClick?: (data: User.Entity) => void
}
// set default timezone for moment
moment.tz.setDefault(siteConfig.defaultTimezone)

export const TeamTable: React.FC<TeamTableProps> = ({ data, owner, onEditRowClick, onDeleteRowClick }) => {
  const columns = useMemo(() => {
    return [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Email',
        accessor: 'email'
      },
      {
        Header: 'Last Login',
        accessor: 'lastLogin',
        Cell: (c?: any) => {
          const row = c?.row?.original
          return <span>{row?.lastLogin ? moment.unix(row?.lastLogin).calendar() : '-'}</span>
        }
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        width: '75px',
        Cell: (c?: any) => {
          const row = c?.row?.original
          if (row?._id === owner?._id)
            return <span className="text-primary text-xs px-3 py-1 rounded-lg border border-stoke">You</span>
          return (
            <div className="flex items-center space-x-2">
              <button
                className="w-7 h-7 rounded-full border text-sm flex items-center justify-center text-primary border-stoke"
                onClick={() => onEditRowClick?.(row)}>
                <MdEdit />
              </button>
              <button
                className="w-7 h-7 rounded-full border text-sm flex items-center justify-center text-red-600 border-stoke"
                onClick={() => {
                  onDeleteRowClick?.(row)
                }}>
                <MdDelete />
              </button>
            </div>
          )
        }
      }
    ]
  }, [onDeleteRowClick, onEditRowClick, owner])
  return <DataTable columns={columns} data={data || []} className="min-h-500px" />
}
