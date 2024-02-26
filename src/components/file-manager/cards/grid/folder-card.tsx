import clsx from 'clsx'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { FolderIcon } from '@/components/common'
import { useCommandHeld } from '@/hooks/use-command-held'
import { getFilePrefix } from '@/lib/utils'
import { selectedFilesState } from '@/stores/file-manager/selected-files'
import { useHookstate } from '@hookstate/core'

import { handleFileManagerClick } from '../../actions/handle-filemanager-click'

export const GridFolderCard: React.FC<FileManager.Folder> = ({ Prefix }) => {
  const commandHeld = useCommandHeld()
  const { push } = useRouter()

  const params = useParams()
  const folders = params?.folder?.toString()
  const folder = (params?.folder as any)?.split('/')

  const selectedFiles = useHookstate(selectedFilesState)
  const files = selectedFiles.get({
    noproxy: true
  })
  const selectFiles = () => {
    if (!Prefix) return
    // update selected files state

    // if the clicked item is not selected, then select it
    if (!files?.[Prefix] && !commandHeld) {
      selectedFiles.set({
        [Prefix]: { Prefix }
      })
    } else {
      // if the item is already selected, then unselect it
      if (files?.[Prefix]) {
        const selected = { ...files }
        delete selected?.[Prefix]
        selectedFiles.set(selected)
      } else {
        // if the item is not selected, then select it
        selectedFiles.merge({
          [Prefix]: { Prefix }
        })
      }
    }
  }
  const handleOpenFolder = async () => {
    if (Prefix?.endsWith('/')) {
      let paths = Prefix
      if (folder?.length) {
        paths = [...folder, Prefix]?.join('/')
      }
      push(`/marketing/drive/${paths}`)
    } else {
      toast.error('This folder is not a directory.')
    }
  }

  return (
    <div
      onClick={selectFiles}
      onDoubleClick={handleOpenFolder}
      onContextMenu={(evt) => handleFileManagerClick('folder', evt, { Prefix }, folders)}
      className={clsx(
        'relative z-0 flex flex-wrap items-center justify-center h-48 px-1 pt-2 text-center border-2 border-transparent border-dashed rounded-lg cursor-pointer select-none sm:h-56 lg:h-60 hover:bg-dark-gray',
        files?.[Prefix] && 'bg-dark-gray'
      )}>
      <div className="w-full">
        <div className="relative mx-auto">
          {/* Folder icon */}
          <div className="inline-block mt-3 mb-5 transform scale-150 lg:mt-2 lg:mb-8 text-primary">
            <FolderIcon />
          </div>
          {/* Folder information such as files count, created at and title. */}
          <div className="text-center">
            <span className="inline-block w-full text-sm font-bold leading-3 tracking-tight text-ellipsis whitespace-nowrap md:px-6">
              {getFilePrefix(Prefix)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
