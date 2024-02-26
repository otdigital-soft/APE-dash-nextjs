import { useMemo } from 'react'
import { FiArrowDown } from 'react-icons/fi'
import { usePagination, useRowSelect, useSortBy, useTable } from 'react-table'

import { Button } from '@/components/ui'
import { SearchInput } from '@/components/ui/forms'
import { cn, omitObject } from '@/lib/utils'

import { DatatableCheckbox } from './checkbox'

const SorterIcon = ({ type }: { type?: 'asc' | 'desc' }) => {
  return (
    <div className="absolute inline-flex flex-col ml-2 transform -translate-y-1/2 top-1/2">
      <FiArrowDown width={12} className={cn(type === 'asc' && 'transform rotate-180')} />
    </div>
  )
}

export type DataTableProps = {
  data: any
  row?: {
    original: any
  }
  loading?: boolean
  columns: any[]
  className?: string
  containerClassName?: string

  searchOnHeader?: boolean
  showPageInfo?: boolean
  showSearch?: boolean
  searchValue?: string

  totalData?: number
  limit?: number
  limitOptions?: number[]
  onSearch?: (data?: string) => void
  onLimitChange?: (limit?: number) => void

  // pagination
  pageCount?: number
  currentPage?: number
  onRowClick?: (...args: any) => void
  onPageChange?: (page?: number, curr?: number) => void
  initialState?: Record<string, any>
  showSelection?: boolean

  showOverflow?: boolean
  showActions?: boolean

  // add row
  showAddRow?: boolean
  addRowText?: string
  onAddRow?: (...args: any) => void

  actions?: JSX.Element
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  pageCount: controlledPageCount,
  currentPage = 1,
  onRowClick,
  initialState,
  showSelection = false,
  showOverflow = false,
  className,
  showSearch,
  onSearch,
  showAddRow,
  addRowText,
  onAddRow,
  containerClassName,
  showActions = true,
  actions
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page
    // gotoPage,
    // pageOptions,
  } = useTable(
    {
      columns: columns || [],
      data: data || [],
      initialState: {
        pageIndex: currentPage - 1,
        ...initialState
      },
      manualPagination: true,
      autoResetPage: false,
      pageCount: controlledPageCount
    },
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      if (!showSelection) return
      hooks.visibleColumns.push((columns) => [
        {
          id: 'selection',
          width: 35,
          Header: ({ getToggleAllRowsSelectedProps }) => <DatatableCheckbox {...getToggleAllRowsSelectedProps()} />,
          Cell: ({ row }) => {
            return <DatatableCheckbox {...row.getToggleRowSelectedProps()} />
          }
        },
        ...columns
      ])
    }
  )

  const showAction = useMemo(() => {
    if (!showActions) return false
    if (showSearch) return true
  }, [showSearch, showActions])

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = e.currentTarget.value
      if (value) {
        onSearch?.(value)
      }
    }
  }

  const handleSearchBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    if (value) {
      onSearch?.(value)
    }
  }
  return (
    <div className={cn('flex flex-col space-y-5', containerClassName)}>
      {/* Table Actions */}
      {showAction && (
        <div className="flex items-center justify-between space-x-3">
          {/* on enter and on blur */}
          <SearchInput onKeyUp={handleSearchEnter} onBlur={handleSearchBlur} />
          <div className="flex items-center space-x-3">
            {actions}
            {showAddRow && (
              <Button onClick={onAddRow} className="text-ellipsis whitespace-nowrap">
                {addRowText || 'Add New'}
              </Button>
            )}
          </div>
        </div>
      )}
      {data?.length > 0 && (
        <div
          className={cn(
            'max-w-full overflow-x-auto justify-between h-full bg-dark-gray border border-#3A3A3A rounded-2xl',
            className
          )}>
          <table className={cn('w-full', !showOverflow && 'overflow-hidden')} {...getTableProps()}>
            <thead className="text-white">
              {headerGroups.map((headerGroup) => (
                <tr
                  className="border-b border-#3A3A3A"
                  key={headerGroup.getHeaderGroupProps()?.key}
                  {...omitObject(headerGroup.getHeaderGroupProps(), ['key'])}>
                  {headerGroup.headers.map((column) => (
                    <th
                      key={column.getHeaderProps()?.key}
                      className={cn(
                        'relative px-3 py-3 font-medium text-sm',
                        (column as any)?.centered ? 'text-center' : 'text-left'
                      )}
                      {...omitObject(column.getHeaderProps(column.getSortByToggleProps()), ['key'])}
                      {...omitObject(
                        column.getHeaderProps({
                          style: { minWidth: column.minWidth, width: column.width }
                        }),
                        ['key']
                      )}>
                      {column.render('Header')}
                      {column.canSort && <SorterIcon type={column.isSortedDesc ? 'desc' : 'asc'} />}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="table-row-bg" {...getTableBodyProps()}>
              {page.map((row: any, i: number) => {
                prepareRow(row)
                return (
                  <tr
                    key={i}
                    onClick={() => onRowClick && onRowClick(row)}
                    className="border-b border-#3A3A3A last:border-b-0"
                    style={{
                      cursor: onRowClick ? 'pointer' : 'default'
                      // '&:hover': {
                      //   boxShadow: onRowClick && 'inset 0px 0px 3px rgba(0,0,0, .2)',
                      //   backgroundColor: onRowClick && 'rgba(0,0,0,.01) !important'
                      // }
                    }}
                    {...omitObject(row.getRowProps(), ['key'])}>
                    {row.cells.map((cell: any) => {
                      return (
                        <td className="relative px-3 py-2" {...cell.getCellProps()} key={cell.getCellProps().key}>
                          {cell.render('Cell')}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export { DataTable }
