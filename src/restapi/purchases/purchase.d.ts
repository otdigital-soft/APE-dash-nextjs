declare namespace Purchase {
  interface Entity {
    _id: string & {
      $oid: string
    }
    customers?: number
    data?: Record<string, any>
    user: string
    name: string
    amount?: amount
    note?: string
    pay_via_stripe: boolean
    price?: number
    state?: string
    created: number
    payment_intent?: {
      id: string
      amount: number
      payment_method_types?: string[]
    }
    __v: number
  }
  interface OptionalData {
    quantity?: number
    repetition?: string
    stripe_price?: string
  }
  interface Dto {
    name: string
    amount: amount
    pay_via_stripe: boolean
  }
}
