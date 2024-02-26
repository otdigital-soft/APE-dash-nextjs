'use client'

import { useParams } from 'next/navigation'
import QueryString from 'qs'
// import qs from 'qs'
import { useEffect, useMemo } from 'react'
import { useLockBodyScroll } from 'react-use'
import useSWR from 'swr'

import { GET_FOLDER_TREE } from '@/restapi/file-managers/constants'
import { fetchUrlState } from '@/stores/file-manager/fetch-url'
import { searchQueryState } from '@/stores/file-manager/search-query'
import { useHookstate } from '@hookstate/core'

import { Loading } from '../ui/button'
import { ActionHeader } from './action-header'
import { ManagerLayout } from './layouts'

interface FileManagerProps {
  initialFolder?: string
  except?: string
  title?: string
}
export const FileManager: React.FC<FileManagerProps> = ({ initialFolder, except, title = 'Marketing Graphics' }) => {
  const fetchUrl = useHookstate(fetchUrlState)
  const searchQuery = useHookstate(searchQueryState)

  const params = useParams()
  let folder = params?.folder
  if (initialFolder) {
    // push initial folder into first array of folder
    folder = `${initialFolder}/${folder}`
  }
  const queries = QueryString.stringify(
    {
      folder: folder || null,
      search: searchQuery.get()
    },
    { skipNulls: true }
  )

  const { data: folders, error } = useSWR<RestApi.Response<FileManager.FolderTree>>(fetchUrl.get() || null)

  const data = useMemo(() => {
    if (!folders?.data?.folders) return null
    return {
      folders: folders?.data?.folders?.filter((folder) => {
        if (!except) return true
        return !except.includes(folder?.Prefix)
      }),
      files: folders?.data?.files
    }
  }, [folders, except])
  // lock body scroll
  useLockBodyScroll(true)

  useEffect(() => {
    fetchUrl.set(`${GET_FOLDER_TREE}?${queries}`)

    return () => {
      fetchUrl.set('')
    }
  }, [queries])

  return (
    <div className="flex flex-col space-y-3">
      <ActionHeader title={title} initialFolder={initialFolder} />
      {/* File manager files & folders list/grid */}
      {!error && !data ? (
        <div
          className="flex items-center justify-center"
          style={{
            height: 'calc(100vh - 18rem)'
          }}>
          <Loading />
        </div>
      ) : (
        <ManagerLayout files={data?.files} folders={data?.folders} initialFolder={initialFolder} />
      )}
    </div>
  )
}
