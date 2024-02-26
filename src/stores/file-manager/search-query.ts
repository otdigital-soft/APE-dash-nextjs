import { hookstate } from '@hookstate/core'

type SearchQueryState = string | null

export const searchQueryState = hookstate<SearchQueryState>(null)
