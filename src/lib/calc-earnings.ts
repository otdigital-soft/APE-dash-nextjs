import moment from 'moment'

export default function calcEarning(
  invoices: { builderName: string; created: number; amount_paid: string }[],
  last_payout_timestamp: number,
  whitelabel?: string
) {
  if (!invoices) {
    throw new Error('cannot calculate funds: missing invoices')
  }

  if (!whitelabel) {
    return { total_earnings: 0, locked_earnings: 0 }
  }

  const friday_two_weeks_before_last_payout = moment.unix(last_payout_timestamp).day(5 - 7 * 2)
  const friday_two_weeks_ago = moment().day(5 - 7 * 2)

  const relevant_invoices = invoices
    .filter(({ builderName }: { builderName: string }) => whitelabel === 'all' || builderName === whitelabel)
    .filter(({ created }: { created: number }) => created > friday_two_weeks_before_last_payout.unix())
  let total_earnings = 0
  let locked_earnings = 0
  for (let i = 0; i < relevant_invoices.length; i++) {
    total_earnings += parseInt(relevant_invoices[i].amount_paid)
    if (relevant_invoices[i].created > friday_two_weeks_ago.unix()) {
      locked_earnings += parseInt(relevant_invoices[i].amount_paid)
    }
  }

  return { total_earnings, locked_earnings }
}
