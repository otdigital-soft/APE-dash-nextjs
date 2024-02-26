// import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { FiLink, FiTrash2 } from 'react-icons/fi'
import { useCopyToClipboard, useDebounce } from 'react-use'

import { confirm } from '@/components/alerts/confirmation'
import { ActionIcon } from '@/components/ui/button/action-icon'
import { SearchInput } from '@/components/ui/forms'
// import { fetchUrlState } from '@/stores/file-manager/fetch-url'
import { searchQueryState } from '@/stores/file-manager/search-query'
import { selectedFilesState } from '@/stores/file-manager/selected-files'
import { useHookstate } from '@hookstate/core'

import { UploadFile } from './upload-file'

// import { mutate } from 'swr'

interface UploadActionProps {
  initialFolder?: string
}
export const UploadAction: React.FC<UploadActionProps> = ({ initialFolder }) => {
  const selectedFiles = useHookstate(selectedFilesState)
  // const fetchUrl = useHookstate(fetchUrlState)
  const [searchString, setSearchString] = useState<string>('')
  const searchQuery = useHookstate(searchQueryState)

  const [, copyToClipboard] = useCopyToClipboard()

  useDebounce(
    () => {
      if (searchString) {
        searchQuery.set(searchString)
      } else {
        searchQuery.set(null)
      }
    },
    1000,
    [searchString]
  )

  const filesCount = useMemo(() => {
    return Object.keys(selectedFiles.get() || []).length
  }, [selectedFiles])

  // const files = useMemo(() => {
  //   const values = Object.values(selectedFiles.get() || {})
  //   let folders = (query?.folder as string[])?.join('/')
  //   if (folders) {
  //     folders = folders + '/'
  //   } else {
  //     folders = ''
  //   }
  //   return values.filter((v) => v.Key).map((file) => folders + file.Key)
  // }, [selectedFiles, query?.folder])

  const handleCopyToClipboard = () => {
    const urls = Object.values(selectedFiles.get() || {})
      .filter((v) => v.Url)
      .map((v) => v.Url)
      .join(', ')
    if (urls) {
      copyToClipboard(urls)
      toast.success('Link copied to clipboard!')
    } else {
      toast.error('File url not found, please try again later.')
    }
  }
  const handleDeleteFiles = async () => {
    const confirmation = await confirm(`Are you sure you want to delete ${filesCount} file(s)?`)
    if (!confirmation) return
    toast.success('File(s) deleted successfully!')
    // const deletes = await deleteFiles(files)
    // if (deletes) {
    //   toast.success('File(s) deleted successfully!')
    //   mutate(fetchUrl.get())
    // } else {
    //   toast.error('Something went wrong, please try again later.')
    // }
  }

  return (
    <div className="flex items-center w-full space-x-3 md:space-x-5 justify-between">
      <SearchInput
        className="text-sm"
        placeholder="Search files..."
        onChange={(evt) => setSearchString(evt.currentTarget?.value)}
        value={searchString}
        onKeyPress={(evt) => {
          if (evt.key === 'Enter') {
            searchQuery.set(evt.currentTarget.value)
          }
        }}
      />
      {/* <UploadDropdown /> */}
      <div className="flex items-center space-x-3">
        <div className="hidden lg:flex items-center space-x-3">
          <ActionIcon onClick={handleCopyToClipboard} disabled={filesCount === 0}>
            <FiLink />
          </ActionIcon>
          <ActionIcon onClick={handleDeleteFiles} disabled={filesCount === 0}>
            <FiTrash2 />
          </ActionIcon>
        </div>
        <UploadFile initialFolder={initialFolder} />
      </div>
    </div>
  )
}
