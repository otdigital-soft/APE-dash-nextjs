export const GET_TEAM_MEMBERS = '/teams/my-team'
export const ADD_TEAM_MEMBER = '/teams/add-member'
export const EDIT_TEAM_MEMBER = (id: string) => `/teams/members/${id}/edit`
export const DELETE_TEAM_MEMBER = (id: string) => `/teams/members/${id}`
