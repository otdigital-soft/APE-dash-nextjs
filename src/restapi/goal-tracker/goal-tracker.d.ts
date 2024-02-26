declare namespace GoalTracker {
  interface Entity {
    _id: string
    type: 'earn' | 'bet'
    goals: {
      sales: number
      calls: number
    }
    achieved: {
      sales: number
      calls: number
    }
    isUserReset: boolean
    isRewardClaimed: boolean
    expiresAt: number
    createdAt: number
  }

  interface CreateDto {
    type?: 'earn' | 'bet'
    sales?: number
    calls?: number
  }

  interface Growth {
    month: string
    reached: number
    unreached: number
    calls: number
    sales: number
  }
}
