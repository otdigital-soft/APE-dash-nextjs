import { selectedFilesState } from '@/stores/file-manager/selected-files'
import { useHookstate } from '@hookstate/core'

export const SelectFiles = (
  data: FileManager.File & {
    Prefix?: string
  }
) => {
  const selectedFiles = useHookstate(selectedFilesState)

  if (!data?.Key && !data?.Prefix) return

  // update selected files state
  // if the clicked item is already selected, then unselect it
  if (selectedFiles.get()?.[data?.Key]) {
    const selected = selectedFiles.get()
    if (selected?.[data?.Key]) {
      // delete in safe way
      const { [data?.Key]: _, ...rest } = selected
      console.log('--deleted ' + _)
      selectedFiles.set(rest)
    } else {
      selectedFiles.set(selected)
    }
  } else {
    selectedFiles.merge({
      [data?.Key]: data
    })
  }
}
