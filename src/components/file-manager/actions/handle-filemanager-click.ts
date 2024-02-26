import { MouseEvent } from 'react'
import { confirmable, createConfirmation } from 'react-confirm'

import { OptionsDropdown } from '../misc/options-dropdown'

export const handleFileManagerClick = async (
  type: 'folder' | 'file',
  evt: MouseEvent<HTMLElement>,
  data?: FileManager.FolderFile,
  folder = ''
) => {
  evt.preventDefault()
  evt.stopPropagation()
  await createConfirmation(confirmable(OptionsDropdown))({
    style: {
      position: 'fixed',
      top: evt.clientY,
      left: evt.clientX
    },
    type,
    data,
    folder
  })
}
