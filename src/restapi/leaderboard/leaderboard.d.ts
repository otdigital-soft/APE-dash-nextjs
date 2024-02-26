import { Business } from '../businesses/business'
import { User } from '../users/user'

export interface Leaderboard {
  _id: string
  business?: Business
  user?: User
  period: string
  revenue?: number
  influence?: number
  leads?: number
  activeCustomers?: number
  rank: {
    revenue: {
      type: 'up' | 'down' | 'equal'
      value: number
    }
    influence: {
      type: 'up' | 'down' | 'equal'
      value: number
    }
  }
  changes: {
    revenue: {
      type: 'up' | 'down' | 'equal'
      value: number
    }
    influence: {
      type: 'up' | 'down' | 'equal'
      value: number
    }
    leads: {
      type: 'up' | 'down' | 'equal'
      value: number
    }
  }
  generatedAt: Date | string
}
