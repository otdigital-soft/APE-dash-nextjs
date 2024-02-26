import { useEffect, useState } from 'react'

import { getSocialConnectorAccount } from '@/restapi/social-connector/mutations'

import { useMe } from './use-me'

export const useBalance = () => {
  const { me } = useMe()
  const [solBalance, setSolBalance] = useState(0)
  const [huslBalance, setHuslBalance] = useState(0)
  useEffect(() => {
    const socialConnectorAccount = async () => {
      if (me?.socialConnectorAddress != undefined) {
        const [husl, sol] = await getSocialConnectorAccount(
          {
            method: 'getTokenAccountsByOwner',
            id: 1,
            jsonrpc: '2.0',
            params: [
              me?.socialConnectorAddress,
              {
                mint: 'BBmsizwKRBJ88Qwot2CDgzjMcE6F1BAfWMD5eR2e29gG'
              },
              {
                encoding: 'jsonParsed'
              }
            ]
          },
          {
            jsonrpc: '2.0',
            id: 1,
            method: 'getAccountInfo',
            params: [
              me?.socialConnectorAddress,
              {
                encoding: 'base58'
              }
            ]
          }
        )
        const hBalance = husl?.result?.value[0]?.account?.data?.parsed?.info?.tokenAmount?.amount
        const sBalance = sol?.result?.value?.lamports
        setHuslBalance(hBalance || 0)
        setSolBalance(sBalance || 0)
      }
    }
    socialConnectorAccount()
  }, [me])

  return { solBalance, huslBalance }
}
