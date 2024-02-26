import { ethers, JsonRpcProvider } from 'ethers'

import { ADDRESS_LUKAS, ADDRESS_NFT, ADDRESS_OWNING_FOUNDERCARDS_AND_BUSINESS_NFTS } from '@/constants/app'

const rpcAddress = 'https://mainnet.infura.io/v3/d044127f59224a2aa4d6e258b0551402'
const provider = new JsonRpcProvider(rpcAddress)

function is_lukas(address: string) {
  return address.toLowerCase() === ADDRESS_LUKAS.toLowerCase()
}

export const fetchNftIdsFromAddress = async (address: string) => {
  if (is_lukas(address)) {
    address = ADDRESS_OWNING_FOUNDERCARDS_AND_BUSINESS_NFTS
  }

  const contractNFT = new ethers.Contract(
    ADDRESS_NFT,
    ['function getIDsByOwner(address owner_) external view returns (uint256[] memory)'],
    provider
  )
  const tokens = await contractNFT.getIDsByOwner(address)
  return tokens
}
