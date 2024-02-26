import api from '@/services/api'

import { DELETE_FILE, DELETE_FILES, DELETE_FOLDER } from './constants'

export const deleteFiles = async (keys: string[]) => {
  return await api
    .delete(DELETE_FILES, {
      data: { keys }
    })
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}

export const deleteFile = async (key: string, folder?: string) => {
  return await api
    .delete(DELETE_FILE + '/' + key, {
      params: {
        folder
      }
    })
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}

export const deleteFolder = async (prefix: string) => {
  return await api
    .delete(DELETE_FOLDER + '?key=' + prefix)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}

export const uploadFile = async (file: File, count: number, folder: string, defaultName?: string, data?: any) => {
  const body = new FormData()
  let name = defaultName
  if (count > 1) {
    name = file.name
  }

  // if name is not with extension, add it
  if (name && !name.includes('.')) {
    name = name + '.' + file?.name.split('.').pop()
  }
  // if folder is not ending with /, add it
  if (folder && !folder.endsWith('/')) {
    folder = folder + '/'
  }
  // if folder is start with /, remove it
  if (folder.startsWith('/')) {
    folder = folder.substring(1)
  }

  const key = folder + name

  body.append('file', file)
  body.append('filename', key)
  body.append('user', data?.user?._id || '')

  return await api
    .post('/files/upload', body)
    .then(({ data }) => data?.data)
    .catch(() => null)
}
