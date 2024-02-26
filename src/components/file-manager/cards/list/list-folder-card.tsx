import clsx from 'clsx'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'

import { FolderIcon } from '@/components/common'
import { useCommandHeld } from '@/hooks/use-command-held'
import { getFilePrefix } from '@/lib/utils'
import { selectedFilesState } from '@/stores/file-manager/selected-files'
import { useHookstate } from '@hookstate/core'

import { handleFileManagerClick } from '../../actions/handle-filemanager-click'

export const ListFolderCard: React.FC<FileManager.Folder> = ({ Prefix }) => {
  const { push, query } = useRouter()
  const folder = query.folder as string[]
  const folders = folder?.join('/')
  const commandHeld = useCommandHeld()

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

  const handleOpenFolder = () => {
    if (Prefix?.endsWith('/')) {
      let paths = Prefix
      if (folder?.length) {
        paths = [...folder, Prefix]?.join('/')
      }
      push(`/marketing-drive/${paths}`)
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
        'flex items-center py-2 border-2 border-transparent border-dashed cursor-pointer select-none rounded-xl px-2.5 hover:bg-dark-gray',
        files?.[Prefix] && 'bg-dark-gray'
      )}>
      <div className="relative w-16 shrink-0">
        <div className="text-primary">
          {/* If there's no folder icon */}
          <FolderIcon />
          {/* TODO: add folder icon getted from api */}
        </div>
      </div>
      <div className="pl-2">
        <span className="block overflow-hidden text-sm font-bold mb-0.5 text-ellipsis whitespace-nowrap hover:underline cursor-text">
          {getFilePrefix(Prefix)}
        </span>
      </div>
    </div>
  )
}
