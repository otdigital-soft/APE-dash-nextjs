import { useEffect, useState } from 'react'

import { getUserData } from '@/lib/fetch-balance'
import { fetchNftIdsFromAddress } from '@/lib/get-nft-ids'
import { getUserByNfts } from '@/restapi/users/mutation'
import { User } from '@/restapi/users/user'

export const useBusinessNfts = (nftId?: string) => {
  const [address, set_address] = useState<string | null | undefined>(undefined)
  const [nfts, setNfts] = useState<Pick<User.Entity, '_id' | 'name' | 'nftId'>[]>([])
  const [balance, set_balance] = useState<number>()

  const getData = async (nftId: string) => {
    await getUserData(nftId).then(({ balance, address }) => {
      set_balance(balance)
      set_address(address)
    })
  }
  useEffect(() => {
    if (nftId) {
      getData(nftId)
    }
  }, [nftId])

  useEffect(() => {
    if (address) {
      fetchNftIdsFromAddress(address).then((nftIds) => {
        const nft = nftIds.map((nftId: any) => Number(nftId)).filter((nft: number) => nft !== Number(nftId))
        getUserByNfts(nft).then(({ data }) => {
          setNfts(data)
        })
      })
    }
  }, [address, nftId])
  return { nfts, address, balance }
}
