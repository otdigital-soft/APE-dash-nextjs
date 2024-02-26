declare namespace FileManager {
  interface File {
    ChecksumAlgorithm?: any[]
    ETag?: string
    Key: string
    LastModified: string
    Size: number
    StorageClass: string
    Url?: string
  }
  interface FileResponse {
    ETag?: string
    key: string
    bucket: string
    url?: string
    _id: string
  }
  interface Folder {
    Prefix: string
  }
  interface FolderFile {
    ChecksumAlgorithm?: any[]
    ETag?: string
    Key?: string
    LastModified?: string
    Size?: number
    StorageClass?: string
    Url?: string
    Prefix?: string
  }
  interface FolderTree {
    folders: Folder[]
    files: File[]
  }
}
