import api from '@/services/api'

import { User } from '../users/user'
import { ADD_TEAM_MEMBER, DELETE_TEAM_MEMBER, EDIT_TEAM_MEMBER } from './constants'
import { Team } from './team'

export const addTeamMember = async (body: Team.AddTeamMemberDto): Promise<RestApi.Response<User.Entity>> => {
  return await api
    .post(ADD_TEAM_MEMBER, body)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err?.response?.data?.message)
    })
}

export const editTeamMember = async (id: string, body: Team.EditTeamMemberDto): Promise<RestApi.Response<User.Entity>> => {
  return await api
    .patch(EDIT_TEAM_MEMBER(id), body)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err?.response?.data?.message)
    })
}

export const deleteTeamMember = async (id: string): Promise<RestApi.Response<User.Entity>> => {
  return await api
    .delete(DELETE_TEAM_MEMBER(id))
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err?.response?.data?.message)
    })
}
