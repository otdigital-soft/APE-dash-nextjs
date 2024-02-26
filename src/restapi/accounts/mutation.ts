import api from '@/services/api'

import { CREATE_ACCOUNT, DELETE_USER_ACCOUNT, EDIT_USER_ACCOUNT } from './constants'

export const createAccount = async (body: Account.Dto): Promise<RestApi.Response<Account.Account>> => {
  return await api
    .post(CREATE_ACCOUNT, body)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}

export const deleteAccount = async (id: string): Promise<RestApi.Response<Account.Account>> => {
  return await api
    .delete(DELETE_USER_ACCOUNT + id)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}

export const editAccount = async (id: string, body: Account.Dto): Promise<RestApi.Response<Account.Account>> => {
  return await api
    .patch(EDIT_USER_ACCOUNT + id, body)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}
