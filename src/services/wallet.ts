import { signIn } from 'next-auth/react'
import Web3 from 'web3'

import api from './api'

export const connectWallet = () => {
  const registerUser = async (address: string) => {
    return await api
      .post('/auth/register', {
        address: address
      })
      .then(({ data }) => data)
  }

  const checkIfUserRegistered = async (address: string) => {
    const response = await api.get(`/wallets/${address}`).then(({ data }) => data.address)
    // Handle response
    if (response === address) {
      return true
    } else {
      const register = await registerUser(address)
      return register
    }
  }

  const connectToMetamask = async () => {
    try {
      const accounts = await window?.ethereum.request({
        method: 'eth_requestAccounts'
      })
      // Check if user is registered, if not, register them
      await checkIfUserRegistered(accounts[0])

      const nonce = await api.get(`/wallets/${accounts[0]}/nonce`).then(({ data }) => data.nonce)

      // Sign message
      const signedMessage = await handleSignMessage(accounts[0], nonce)
      const connection = await signIn('wallet', {
        redirect: false,
        ...signedMessage
      })

      return connection
    } catch (e) {
      console.log(e)
      console.error('Error connecting to Metamask')
      // throw new Error(error?.message)
    }
  }

  const handleSignMessage = async (publicAddress: string, nonce: number): Promise<any> => {
    // todo make alert when there's no etherium provider
    if (!window.ethereum) return
    // Define instance of web3
    const web3 = new Web3(window.ethereum)

    return new Promise((resolve, reject) =>
      web3.eth.personal.sign(web3.utils.fromUtf8(`Nonce: ${nonce}`), publicAddress, '', (err: any, signature: any) => {
        if (err) return reject(err)
        return resolve({ publicAddress, signature })
      })
    )
  }

  return connectToMetamask()
}
