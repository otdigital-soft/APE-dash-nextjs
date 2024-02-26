import { Business } from '../businesses/business'
import { Team } from '../teams/team'

declare namespace User {
  interface Entity {
    [x: string]: undefined
    _id: string
    name: string
    email: string
    verified: boolean
    discordUsername?: string
    websiteKey?: string
    verified_at?: string
    nftId?: string
    picture?: string
    password?: string
    role?: 'user' | 'admin' | 'member'
    team?: Team.Entity
    created_at: string
    updated_at?: string
    deleted_at?: string
    last_login?: string
    foundersCard?: string
    websiteUrl?: string
    productUrl?: string
    business?: Business[]
    permissions?: string[]
    socialConnectorEmail?: string
    socialConnectorAddress?: string
    clients?: number
    noPassword?: boolean
  }
  interface Dto {
    websiteKey?: string
    name?: string
    nftId?: string
    email?: string
    company?: string
    currentPassword?: string
    socialConnectorEmail?: string
    socialConnectorAddress?: string
    newPassword?: string
    profilePicture?: string
    discordUsername?: string
  }
}
