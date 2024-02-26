import { viewTypeState } from '@/stores/file-manager/view-type'
import { useHookstate } from '@hookstate/core'

export const useFileManagerView = () => {
  const viewType = useHookstate(viewTypeState)
  const type = viewType.get()

  const toggleViewType = () => {
    viewType.set(type === 'list' ? 'grid' : 'list')
  }

  return { viewType: type, toggleViewType }
}
