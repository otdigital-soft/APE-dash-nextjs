import { ComponentType, HTMLProps, useRef } from 'react'
import { ReactConfirmProps } from 'react-confirm'
import { MdCloudUpload, MdCreateNewFolder, MdDriveFolderUpload } from 'react-icons/md'
import { useClickAway } from 'react-use'

interface RootOptionsDropdownProps extends HTMLProps<HTMLDivElement> {
  style?: React.CSSProperties
}

export const RootOptionsDropdown: ComponentType<ReactConfirmProps & RootOptionsDropdownProps> = ({ style }) => {
  const dialogRef = useRef<HTMLUListElement>(null)

  useClickAway(dialogRef, () => {
    dialogRef?.current?.parentElement?.remove()
  })

  return (
    <ul
      ref={dialogRef}
      className="z-30 flex flex-col justify-start w-56 py-1 overflow-auto text-base text-left rounded-lg bg-dark-gray shadow-frame ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm top-12 divide-opacity-50 optionDropdown"
      style={style}>
      <li>
        <button className="flex items-center w-full px-5 py-3 space-x-3 text-gray-300 hover:bg-dark hover:text-primary">
          <MdCloudUpload className="text-xl" />
          <span>Upload Files</span>
        </button>
      </li>
      <li>
        <button className="flex items-center w-full px-5 py-3 space-x-3 text-gray-300 hover:bg-dark hover:text-primary">
          <MdDriveFolderUpload className="text-xl" />
          <span>Upload Folder</span>
        </button>
      </li>
      <li>
        <button className="flex items-center w-full px-5 py-3 space-x-3 text-gray-300 hover:bg-dark hover:text-primary">
          <MdCreateNewFolder className="text-xl" />
          <span>Create Folder</span>
        </button>
      </li>
    </ul>
  )
}
