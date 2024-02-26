declare namespace Reward {
  interface Entity {
    _id: string
    name: string
    description: string
    amount: number
    reference?: string
    claimableBy?: string[]
    createdAt: Date
  }

  interface ClaimableReward {
    type: 'ok' | 'no_permission' | 'claimed'
    reward: Entity
  }
}
