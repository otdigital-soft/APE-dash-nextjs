import Web3 from 'web3'
import { AbiItem } from 'web3-utils'

import ABI_ERC20 from '@/shared/jsons/abi_erc20.json'
import ABI_ERC721 from '@/shared/jsons/abi_erc721.json'
import { ADDRESS_FOUNDERSCARD, ADDRESS_CONTRACT, ADDRESS_NFT } from '@/constants/app'

const CACHE_INTERVAL = 300

async function requireEthereumNetwork(web3: Web3) {
  const networkId = await web3.eth.net.getId()
  if (networkId !== 1) {
    throw new Error('Please switch to Ethereum network in your Metamask wallet.')
  }
}

function calculateStorageKey(nftId: string) {
  return 'userdata_' + nftId + Math.floor(Date.now() / 1000 / CACHE_INTERVAL)
}

function cacheUserData(nftId: string, userData: Record<string, any>) {
  if (nftId) {
    const storageKey = calculateStorageKey(nftId)
    localStorage.setItem(storageKey, JSON.stringify(userData))
  }
}

export async function getUserData(nftId: string) {
  if (nftId) {
    const cachedData = getCachedUserData(nftId)
    if (cachedData) {
      return cachedData
    } else {
      let address, balance
      try {
        address = await fetchAddress(parseInt(nftId))
      } catch (error) {
        address = null
        console.error(error)
      }
      try {
        balance = await fetchUSDHBalance(address)
      } catch (error) {
        balance = -1
        console.error(error)
      }
      const userData = { address, balance }
      cacheUserData(nftId, userData)
      return userData
    }
  } else {
    return null
  }
}

function getCachedUserData(nftId: string) {
  if (nftId) {
    const storage_key = 'userdata_' + nftId + Math.floor(Date.now() / 1000 / CACHE_INTERVAL)

    const cached_data_string = localStorage.getItem(storage_key)

    if (cached_data_string) {
      return JSON.parse(cached_data_string)
    } else {
      return null
    }
  } else {
    return null
  }
}

export async function fetchAddress(token_id?: number) {
  if (!token_id) {
    return null
  }
  try {
    const web3 = new Web3(window.ethereum)
    await requireEthereumNetwork(web3)
    const contract_nft = new web3.eth.Contract(ABI_ERC721 as AbiItem[], token_id < 0 ? ADDRESS_FOUNDERSCARD : ADDRESS_NFT)
    return await contract_nft.methods.ownerOf(token_id).call()
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function fetchUSDHBalance(address?: string) {
  if (!address) {
    return -1
  }
  try {
    const web3 = new Web3(window.ethereum)
    await requireEthereumNetwork(web3)
    const contract_usdh = new web3.eth.Contract(ABI_ERC20 as AbiItem[], ADDRESS_CONTRACT)
    return await contract_usdh.methods.balanceOf(address).call()
  } catch (e) {
    console.error(e)
    return -1
  }
}
