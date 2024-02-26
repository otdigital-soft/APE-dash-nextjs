import Stripe from 'stripe'

interface StripeConfig {
  publishableKey: string
  secretKey: string
  whitelabelTag?: string
  stripeUserId?: string
  refreshToken?: string
  user: string
}

interface IANStripeResponse {
  stripeAccountId: string
  isConnected: boolean
}

interface StripeConfigDto {
  publishableKey: string
  secretKey: string
  whitelabelTag?: string
  stripeUserId?: string
  refreshToken?: string
  user?: string // admin only
}
interface Balance {
  balance: number
  availableBalance: number
  balanceDetails: Stripe.Balance
  payout: number
  fees: number
  transactions: Stripe.BalanceTransaction[]
}

interface Revenue {
  reportDate: number
  allTransactions: {
    amount: number
    lastTransactionAt: number
    data: Stripe.Invoice[]
  }
  transactions: {
    amount: number
    lastTransactionAt: number
    data: Stripe.Invoice[]
  }
  todayTransactions: {
    amount: number
    lastTransactionAt: number
    data: Stripe.Invoice[]
  }
  alltimeStats: {
    month: string
    monthShort: string
    amount: number
  }[]
  stats: {
    label?: any[]
    data?: any[]
  }
}

interface GrowthReport {
  reportDate: number
  period: string
  data?: {
    amount: number
    month: string
    monthShort: string
  }[]
}

interface ChurnRate {
  reportDate: number
  activeSubscriptions: number
  churnedSubscriptions: number
  churnedRevenue: {
    month: string
    monthShort: string
    amount: number
  }[]
  churnRate: number
}

interface StripeCPA {
  reportDate: number
  totalSubscriptions: number
  totalTransaction: number
  data?: {
    month?: string
    monthShort?: string
    transaction?: number
    cpa?: number
  }[]
}

interface StripeCustomer {
  reportDate: number
  totalCustomers: number
  data?: {
    month?: string
    monthShort?: string
    customers?: number
  }[]
  stats?: {
    label?: string[]
    data?: {
      label?: string
      labelShort?: string
      value?: number
    }[]
  }
}

interface StripeCustomerGrowth {
  reportDate: number
  totalCustomers: number
  data?: {
    month?: string
    monthShort?: string
    thisYear?: number
    lastYear?: number
  }[]
  trx?: {
    thisMonth: number
    lastMonth: number
  }
}
