import api from '@/services/api'

import { Business, CreateBusinessDto, UpdateBusinessDto } from './business'
import { CREATE_BUSINESS, DELETE_BUSINESS, GET_BUSINESSES, UPDATE_BUSINESS } from './constants'

export const createBusiness = async (data: CreateBusinessDto): Promise<RestApi.Response<Business>> => {
  return await api
    .post(CREATE_BUSINESS, data)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}

export const updateBusiness = async (id: string, data: UpdateBusinessDto): Promise<RestApi.Response<Business>> => {
  return await api
    .patch(UPDATE_BUSINESS + id, data)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err?.response?.data?.message)
    })
}

export const deleteBusiness = async (id: string): Promise<RestApi.Response<Business>> => {
  return await api
    .delete(DELETE_BUSINESS + id)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}

export const getBusinesses = async (params?: Record<string, any>): Promise<RestApi.Response<Business[]>> => {
  return api
    .get(GET_BUSINESSES, { params })
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}
