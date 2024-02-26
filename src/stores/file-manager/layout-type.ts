import { hookstate } from '@hookstate/core'

type LayoutTypeState = {
  type: 'compact' | 'full'
  previewData?: any
}

export const layoutTypeState = hookstate<LayoutTypeState>({
  type: 'full',
  previewData: undefined
})
