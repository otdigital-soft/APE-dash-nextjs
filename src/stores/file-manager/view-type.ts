import { hookstate } from '@hookstate/core'

type viewTypeState = 'list' | 'grid'

export const viewTypeState = hookstate<viewTypeState>('grid')
