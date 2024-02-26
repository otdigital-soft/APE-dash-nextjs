import api from '@/services/api'

import { DELETE_USER, GET_USER_BY_NFTS, RESTORE_USER, UPDATE_USERS } from './constants'
import { User } from './user'

export const editUser = async (id: string, body?: User.Dto): Promise<RestApi.Response<User.Entity>> => {
  if (!body?.profilePicture) {
    delete body?.profilePicture
  }
  return await api
    .patch(UPDATE_USERS + id, body)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err?.response?.data?.message)
    })
}

export const deleteUser = async (id: string): Promise<RestApi.Response<User.Entity>> => {
  return await api
    .delete(DELETE_USER + id)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err?.response?.data?.message)
    })
}

export const restoreUser = async (id: string): Promise<RestApi.Response<User.Entity>> => {
  return await api
    .patch(RESTORE_USER + id)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err?.response?.data?.message)
    })
}

export const getUserByNfts = async (
  nftIds: string | string[]
): Promise<RestApi.Response<Pick<User.Entity, '_id' | 'name' | 'nftId'>[]>> => {
  let ids = ''
  if (Array.isArray(nftIds)) {
    ids = nftIds.join(',')
  } else {
    ids = nftIds
  }
  return await api
    .get(GET_USER_BY_NFTS + ids)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err?.response?.data?.message)
    })
}
