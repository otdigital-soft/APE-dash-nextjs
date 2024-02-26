import { hookstate } from '@hookstate/core'

type MenuState = 'collapsed' | 'full'

export const menuState = hookstate<MenuState>('collapsed')
