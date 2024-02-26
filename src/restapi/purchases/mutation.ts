import { toast } from 'react-hot-toast'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'

import { ADDRESS_RECEIVER, ADDRESS_USDC, CENTS_PER_USD } from '@/constants/app'
// prettier-ignore
import api from '@/services/api'
import ABI_ERC20 from '@/shared/jsons/abi_erc20.json'

import {
  ADD_TX_HASH_TO_PURCHASE,
  CREATE_DIRECT_PURCHASE,
  CREATE_PURCHASE,
  CREATE_SUBSCRIPTION,
  TEST,
  UPDATE_PURCHASE
} from './constants'

function current_unix_timestamp() {
  return Math.floor(Date.now() / 1000)
}

export const createPurchase = async (
  name: string,
  price: number,
  is_stripe_not_usdh: boolean,
  optional_data: Purchase.OptionalData
): Promise<RestApi.Response<Purchase.Entity>> => {
  const purchase: Record<string, any> = {
    name: name,
    price: price,
    created: current_unix_timestamp(),
    state: 'pending',
    is_stripe_not_usdh: is_stripe_not_usdh,
    data: optional_data
  }
  return await api
    .post(CREATE_PURCHASE, purchase)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}

export const createDirectPurchase = async (
  user: string,
  name: string,
  note: string,
  optional_data: Purchase.OptionalData
): Promise<RestApi.Response<Purchase.Entity>> => {
  const purchase: Record<string, any> = {
    user,
    name,
    note,
    created: current_unix_timestamp(),
    data: optional_data
  }
  return await api
    .post(CREATE_DIRECT_PURCHASE, purchase)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}

export const deleteDirectPurchase = async (purchase_id: string): Promise<RestApi.Response<Purchase.Entity>> => {
  return await api
    .delete(CREATE_DIRECT_PURCHASE + '/' + purchase_id)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}

export const createSubscription = async (
  name: string,
  price: number,
  is_stripe_not_usdh: boolean,
  optional_data?: Purchase.OptionalData
): Promise<any> => {
  const purchase: Record<string, any> = {
    name: name,
    price: price,
    created: current_unix_timestamp(),
    state: 'pending',
    is_stripe_not_usdh: is_stripe_not_usdh,
    data: optional_data
  }
  return await api
    .post(CREATE_SUBSCRIPTION, purchase)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}

export const updatePurchase = async (purchase_id: string): Promise<RestApi.Response<Purchase.Entity>> => {
  const data: Record<string, any> = {
    purchase_id: purchase_id
  }
  return await api
    .post(UPDATE_PURCHASE, data)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}

export const test = async (args: Record<string, any> = {}): Promise<RestApi.Response<Purchase.Entity>> => {
  const data: Record<string, any> = args
  return await api
    .post(TEST, data)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}

export const addTransactionHashToPurchase = async (
  purchase_id: string,
  transaction_hash: string
): Promise<RestApi.Response<Purchase.Entity>> => {
  const data: Record<string, any> = {
    purchase_id: purchase_id,
    transaction_hash: transaction_hash
  }
  return await api
    .post(ADD_TX_HASH_TO_PURCHASE, data)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
}

export const purchaseViaUSDH = async (
  message: string,
  amount_transfer: number,
  amount_approve = 0,
  data: Purchase.OptionalData,
  set_is_waiting: any
) => {
  const result = await createSubscription(message, amount_transfer * CENTS_PER_USD, false, data).then((data) => data)
  const purchaseId = result?.purchase_id
  const provider = window.ethereum
  const web3 = new Web3(provider)
  const network_id = await web3.eth.net.getId()
  if (network_id !== 1) {
    alert('Please switch to Ethereum network in your Metamask wallet.')
    return
  }

  provider
    .request({ method: 'eth_requestAccounts' })
    .then(async (accounts: string[]) => {
      const address = accounts[0]
      const contract_usdh = new web3.eth.Contract(ABI_ERC20 as AbiItem[], ADDRESS_USDC)

      //let balance_usdh = await contract_usdh.methods.balanceOf(address).call();

      const amount_transfer_erc20: string = amount_transfer + '000000000000000000'
      set_is_waiting(true)
      const transaction = await contract_usdh.methods
        .transfer(ADDRESS_RECEIVER, amount_transfer_erc20)
        .send({ from: address })
      const transactionHash = transaction.transactionHash
      set_is_waiting(false)

      await addTransactionHashToPurchase(purchaseId, transactionHash)

      if (amount_approve > 0) {
        toast.success(
          'You have now paid for the first month. To allow for renewal of your subscription, please approve more USDH to be spent over the coming months.'
        )
        const amount_approve_erc20: string = amount_approve + '000000000000000000'
        set_is_waiting(true)
        await contract_usdh.methods.approve(ADDRESS_RECEIVER, amount_approve_erc20).send({ from: address })
        set_is_waiting(false)
      }
    })
    .catch((e: any) => {
      set_is_waiting(false)
      toast.error(e?.response?.message || e?.message || e)
    })
}

export const subscribeViaStripe = async (message: string, amount_in_usd: number, data: Record<string, any>) => {
  const response = await createSubscription(message, amount_in_usd * CENTS_PER_USD, true, data).then((data) => data)
  // console.log(response)
  window.open(response?.subscription_session?.url)
}

export const getFlatratePrice = (is_subscribed: boolean) => {
  return is_subscribed ? 300 : 375
}

export const getFlatrateStripePrice = (is_subscribed: boolean, repetition: string) => {
  switch (repetition) {
    case 'weekly':
      return is_subscribed ? 'price_1MFfziCOIb8tHxq58AhDA66b' : 'price_1MFg2GCOIb8tHxq5C6eoVvEt'
    case 'monthly':
      return is_subscribed ? 'price_1MFfziCOIb8tHxq5glFmv5M8' : 'price_1MFg1zCOIb8tHxq528We3VmN'
    case 'once':
    default:
      return is_subscribed ? 'price_1MFfziCOIb8tHxq5hVFZ8wTw' : 'price_1MFg1dCOIb8tHxq5BXy5gMOw'
  }
}

export const isValidSubscriptionInPurchases = (purchases: { name: string; state?: string }[]) => {
  if (purchases) {
    for (let i = 0; i < purchases.length; i++) {
      if (purchases[i].name === 'subscription' && purchases[i].state === 'completed') {
        return true
      }
    }
  }
  return false
}
