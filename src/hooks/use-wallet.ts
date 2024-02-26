import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Web3 from 'web3'

import { connectWallet } from '@/services/wallet'

interface Wallet {
  balance: {
    value: number
    formatted: string
  }
  address: string | null
  connected: boolean
  loading: boolean
  accounts: string[]
  walletDisconnected: boolean
  connectWallet: () => Promise<any>
}

const initialState = {
  balance: {
    value: 0,
    formatted: '0'
  },
  address: null,
  connected: false,
  loading: true,
  accounts: [],
  walletDisconnected: false,
  connectWallet
}

export const useStaticWallet = (walletAddress: string) => {
  const [instance, setInstance] = useState<Wallet>(initialState)

  useEffect(() => {
    const fetchInstances = async (web3: any) => {
      if (!walletAddress) {
        return setInstance({
          ...instance,
          walletDisconnected: true
        })
      }
      try {
        const balance = await web3.eth.getBalance(walletAddress)
        const address = walletAddress

        const accounts = await window?.ethereum.request({
          method: 'eth_requestAccounts'
        })

        setInstance({
          ...instance,
          balance: {
            value: balance,
            formatted: web3.utils.fromWei(balance, 'ether')
          },
          address: address || initialState.address,
          connected: true,
          accounts: accounts || initialState.accounts
        })
      } catch (error) {
        // if error happens, we should sign out the user
        // signOut({
        //   redirect: true,
        //   callbackUrl: '/auth'
        // })
      }
    }
    if (status === 'loading') return
    let web3 = window.web3
    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider)
    } else {
      web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    }

    fetchInstances(web3)

    return () => {
      setInstance(initialState)
    }
  }, [walletAddress])
  return instance
}

export const useWallet = () => {
  const { data: session, status } = useSession()

  const [instance, setInstance] = useState<Wallet>(initialState)

  useEffect(() => {
    const fetchInstances = async (web3: any) => {
      if (!session) {
        return setInstance({
          ...instance,
          walletDisconnected: true
        })
      }
      try {
        const balance = await web3.eth.getBalance(session?.address)
        const address = session?.address

        const accounts = await window?.ethereum.request({
          method: 'eth_requestAccounts'
        })

        setInstance({
          ...instance,
          balance: {
            value: balance,
            formatted: web3.utils.fromWei(balance, 'ether')
          },
          address: address || initialState.address,
          connected: Boolean(session?.jwt && session?.address),
          accounts: accounts || initialState.accounts,
          walletDisconnected: !accounts?.length || !session?.jwt || !session?.address
        })
      } catch (error) {
        // if error happens, we should sign out the user
        // signOut({
        //   redirect: true,
        //   callbackUrl: '/auth'
        // })
      }
    }

    if (status === 'loading') return
    let web3 = window.web3
    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider)
    } else {
      web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    }

    fetchInstances(web3)

    return () => {
      setInstance(initialState)
    }
  }, [session, status])
  return instance
}
