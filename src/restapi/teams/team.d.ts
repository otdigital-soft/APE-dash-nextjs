import { User } from '../users/user'

declare namespace Team {
  interface Entity {
    _id: string
    owner: User.Entity
    members: User.Entity[]
    logs?: string[]
    createdAt: string
  }

  interface AddTeamMemberDto {
    email: string
    name: string
    password: string
    permissions: string[]
  }

  interface EditTeamMemberDto {
    name: string
    newPassword?: string
    permissions: string[]
  }
}
