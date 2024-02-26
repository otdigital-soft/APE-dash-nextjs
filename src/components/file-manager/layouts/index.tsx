import clsx from 'clsx'
import { useRef } from 'react'

import { layoutTypeState } from '@/stores/file-manager/layout-type'
import { selectedFilesState } from '@/stores/file-manager/selected-files'
import { useHookstate } from '@hookstate/core'

import { handleFileManagerRootClick } from '../actions/handle-file-manager-root-click'
import { GridFileCard, GridFolderCard } from '../cards'

interface ManagerLayoutProps {
  folders?: FileManager.Folder[]
  files?: FileManager.File[]
  initialFolder?: string
}
export const ManagerLayout: React.FC<ManagerLayoutProps> = ({ folders, files, initialFolder }) => {
  const layoutType = useHookstate(layoutTypeState)
  const layout = layoutType.get()
  // const { headerHeight } = useHeaderHeight()
  const gridRef = useRef<HTMLDivElement>(null)

  const selectedFiles = useHookstate(selectedFilesState)

  const handleClickRoot = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // if the user clicks on the layout, then unselect all files
    if (evt.target === gridRef.current) {
      selectedFiles.set({})
    }
  }
  if (!folders?.length && !files?.length) {
    return (
      <span>
        <p className="block mt-5 text-sm text-gray-400 ml-7">This folder has no content.</p>
      </span>
    )
  }
  return (
    <div
      onClick={handleClickRoot}
      onContextMenu={handleFileManagerRootClick}
      className="relative z-0 max-h-80vh overflow-y-auto">
      <div
        ref={gridRef}
        className={clsx(
          'px-4 lg:w-full lg:h-full lg:overflow-y-auto lg:px-0 loverflow-y-auto',
          layout.type === 'full' ? 'grid lg:grid-cols-5 xl:grid-cols-6 lg:gap-4 grid-cols-2' : 'grid lg:grid-cols-4 lg:gap-4'
        )}>
        {folders?.map((folder, i) => (
          <GridFolderCard key={i} {...folder} />
        ))}

        {files?.map((file, i) => (
          <GridFileCard key={i} initialFolder={initialFolder} {...file} />
        ))}
      </div>
    </div>
  )
}
