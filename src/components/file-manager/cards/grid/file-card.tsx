import clsx from 'clsx'
import moment from 'moment'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import { FiLink } from 'react-icons/fi'

import { useCommandHeld } from '@/hooks/use-command-held'
import { formatBytes, isPreviewable } from '@/lib/utils'
import { selectedFilesState } from '@/stores/file-manager/selected-files'
import { useHookstate } from '@hookstate/core'

import { handleFileManagerClick } from '../../actions/handle-filemanager-click'
import { DefaultFileThumbnail } from '../../misc/file-thumbnail'

interface GridFileCardProps extends FileManager.File {
  initialFolder?: string
}
export const GridFileCard: React.FC<GridFileCardProps> = (props) => {
  const commandHeld = useCommandHeld()
  const { Size, Key, LastModified, Url } = props

  const params = useParams()
  const folder = (params?.folder as any)?.split('/')

  const folders = useMemo(() => {
    let flds = folder as string[]
    // add initial folder to the first array of folder
    if (props?.initialFolder) {
      flds = [props?.initialFolder, ...(folder || [])]
    }
    return flds?.join('/')
  }, [props?.initialFolder, folder])

  // TODO make it reusable
  const selectedFiles = useHookstate(selectedFilesState)
  const files = selectedFiles.get({
    noproxy: true
  })
  const selectFiles = () => {
    if (!props?.Key) return
    // update selected files state

    // if the clicked item is not selected, then select it
    if (!files?.[Key] && !commandHeld) {
      selectedFiles.set({
        [props?.Key]: props
      })
    } else {
      // if the item is already selected, then unselect it
      if (files?.[Key]) {
        const selected = { ...files }
        delete selected?.[Key]
        selectedFiles.set(selected)
      } else {
        // if the item is not selected, then select it
        selectedFiles.merge({
          [props?.Key]: props
        })
      }
    }
  }

  return (
    <div
      onClick={selectFiles}
      onContextMenu={(evt) => handleFileManagerClick('file', evt, props, folders)}
      className={clsx(
        'relative z-0 flex flex-wrap items-center justify-center h-48 px-1 pt-2 text-center border-2 border-transparent border-dashed rounded-lg cursor-pointer select-none sm:h-56 lg:h-60 hover:bg-dark-gray',
        files?.[Key] && 'bg-dark'
      )}>
      <div className="w-full">
        <div className="relative mx-auto">
          {Url && isPreviewable(Url) ? (
            <div className="relative inline-block h-24 mb-4 w-28 lg:h-28 lg:w-36">
              <Image src={Url} alt="preview" fill className="object-cover rounded-lg pointer-events-none" />
            </div>
          ) : (
            <div className="relative w-16 mx-auto">
              {/* If there's no File icon */}
              <DefaultFileThumbnail filename={Url} />
            </div>
          )}
          {/* Folder information such as files count, created at and title. */}
          <div className="text-center">
            <p className="inline-block w-full overflow-x-hidden text-sm font-bold leading-3 tracking-tight text-ellipsis whitespace-nowrap md:px-6">
              {Key}
            </p>
            <div className="flex items-center justify-center">
              <span className="flex flex-col text-xs text-gray-500 dark:text-gray-500">
                <p className="flex justify-center space-x-1">
                  <FiLink className="text-primary" />
                  <span>{formatBytes(Size)},</span>
                </p>
                <span className="hidden lg:inline-block">{moment(LastModified).format('DD. MMM. YYYY, HH:mm')}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
