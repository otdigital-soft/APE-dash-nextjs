import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import calcEarning from '@/lib/calc-earnings'
import { getUserData } from '@/lib/fetch-balance'
import { GET_USER_INVOICES } from '@/restapi/finances/constants'
import { GET_USER_PAYOUTS } from '@/restapi/payouts/constants'
import { getFounderCards } from '@/restapi/payouts/mutation'

import { useMe } from './use-me'

interface PayoutTransaction {
  timestamp: number
  value: number
  tx_hash: string
  status?: 'pending' | 'success' | 'failed'
}
export const useStripeBalance = () => {
  const { me } = useMe()
  const [balance, set_balance] = useState(0)
  const [pending, set_pending] = useState(0)
  const [amount_due, set_amount_due] = useState(0)
  const { data: payouts } = useSWR<RestApi.Response<any>>(GET_USER_PAYOUTS)
  const { data: invoices } = useSWR<RestApi.Response<any>>(`${GET_USER_INVOICES}?unix_min=0&unix_max=2000000000`)

  const payout_transactions: PayoutTransaction[] = useMemo(() => {
    return payouts?.data.payouts.map(({ created, amount_paid, transaction }: any) => ({
      timestamp: created,
      value: amount_paid,
      tx_hash: transaction.transactionHash,
      status: transaction.status ? 'success' : 'pending'
    }))
  }, [payouts?.data.payouts])

  useEffect(() => {
    if (invoices && payouts && me) {
      const last_payout_timestamp = Math.max(
        0,
        ...(payouts?.data.payouts.map(({ created }: { created: number }) => created) || [])
      )
      const { locked_earnings } = calcEarning(invoices?.data, last_payout_timestamp, 'all')

      set_pending(locked_earnings)

      try {
        getFounderCards(me?.nftId || '').then((founder_cards) => {
          const payout_ratio = (founder_cards?.length || 0) >= 15 ? 0.77 : 0.76
          set_amount_due(locked_earnings * payout_ratio)
        })
      } catch (error) {
        console.error(error)
      }
    }
  }, [invoices, payouts, me])

  useEffect(() => {
    const nftId = me?.nftId
    if (nftId) {
      getUserData(nftId).then(({ balance }) => {
        set_balance(balance)
      })
    }
  }, [me])
  return { balance, pending, amount_due, payout_transactions }
}
