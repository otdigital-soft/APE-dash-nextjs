import { hookstate } from '@hookstate/core'

type SelectedFilesState = {
  [key: string]: {
    Prefix?: string
    ChecksumAlgorithm?: any[]
    ETag?: string
    Key?: string
    LastModified?: string
    Size?: number
    StorageClass?: string
    Url?: string
  }
} | null

export const selectedFilesState = hookstate<SelectedFilesState>(null)
