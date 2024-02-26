import { hookstate } from '@hookstate/core'

type fetchUrlState = string

export const fetchUrlState = hookstate<fetchUrlState>('')
