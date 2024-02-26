'use client'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { MdCheck, MdHorizontalRule } from 'react-icons/md'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'

import { Button } from '@/components/ui'
import { ADDRESS_FOUNDERSCARD, ADDRESS_STAKING } from '@/constants/app'
import { useMe } from '@/hooks/use-me'
import ABI_ERC721 from '@/shared/jsons/abi_erc721.json'
import ABI_FOUNDERSCARD from '@/shared/jsons/abi_founderscard.json'
import ABI_STAKING from '@/shared/jsons/abi_staking.json'

import { DataTable } from '../'
import { FounderCardTableActions } from './actions'

const web3Init = async () => {
  const provider = window.ethereum
  const web3 = new Web3(provider)
  const network_id = await web3.eth.net.getId()
  if (network_id !== 1) {
    const error_message = `Please switch to Ethereum network in your Metamask wallet (you are on network #${network_id}).`
    alert(error_message)
    throw new Error(error_message)
  }

  const address = await provider.request({ method: 'eth_requestAccounts' }).then(async (accounts: string[]) => accounts[0])
  return { web3, address }
}

async function getFCOwner(token_id: number) {
  const { web3 } = await web3Init()
  const contractFounderscard = new web3.eth.Contract(ABI_ERC721 as AbiItem[], ADDRESS_FOUNDERSCARD)
  return await contractFounderscard.methods.ownerOf(token_id).call()
}

async function getFCByOwner(owner: string) {
  const { web3 } = await web3Init()
  const contractFounderscard = new web3.eth.Contract(ABI_FOUNDERSCARD as AbiItem[], ADDRESS_FOUNDERSCARD)
  return await contractFounderscard.methods.getIDsByOwner(owner).call()
}

async function fetchBalances(owner: string, founder_cards: number[]) {
  const { web3 } = await web3Init()
  const contract_staking = new web3.eth.Contract(ABI_STAKING as AbiItem[], ADDRESS_STAKING)
  const deposit_counter = await contract_staking.methods.deposit_count().call()
  return Promise.all(
    founder_cards.map(async (foundercard: number) => {
      const balance_string = await contract_staking.methods.get_balance(foundercard).call()
      const staker = await contract_staking.methods.get_staker(foundercard, deposit_counter).call()

      const is_staked = staker.toLowerCase() == owner.toLowerCase()
      const balance = parseInt(balance_string)
      return {
        foundercard,
        balance,
        is_staked
      }
    })
  )
}

async function withdraw(foundercard: string) {
  const { web3 } = await web3Init()
  const address = await getFCByOwner(foundercard)
  const contractStaking = new web3.eth.Contract(ABI_STAKING as AbiItem[], ADDRESS_STAKING)
  await contractStaking.methods.withdraw(foundercard).send({ from: address })
}

// async function stake(foundercard: string) {
//   const { web3 } = await web3Init()
//   const address = await getFCByOwner(foundercard)
//   const contractStaking = new web3.eth.Contract(ABI_STAKING as AbiItem[], ADDRESS_STAKING)
//   await contractStaking.methods.stake(foundercard).send({ from: address })
//   window.location.reload()
// }

async function withdrawAll() {
  const { web3, address } = await web3Init()
  const contract_staking = new web3.eth.Contract(ABI_STAKING as AbiItem[], ADDRESS_STAKING)
  await contract_staking.methods.withdraw_all().send({ from: address })
}

async function stakeAll() {
  const { web3, address } = await web3Init()
  const contract_staking = new web3.eth.Contract(ABI_STAKING as AbiItem[], ADDRESS_STAKING)
  await contract_staking.methods.stake_all().send({ from: address })
}

export const FounderCardTable: React.FC = () => {
  const { me } = useMe()
  const [founderCards, setFounderCards] = useState<number[] | undefined>(undefined)
  const [owner, set_owner] = useState<string | undefined>(undefined)
  const [data, setData] = useState<any[] | undefined>(undefined)

  const handleWithdraw = async (foundercard: string) => {
    // await withdraw(foundercard)
    toast.promise(withdraw(foundercard), {
      loading: 'Withdrawing...',
      success: 'Withdrawed!',
      error: 'Error!'
    })
  }

  const handleWithdrawAll = async () => {
    toast.promise(withdrawAll(), {
      loading: 'Withdrawing...',
      success: 'Withdrawed!',
      error: 'Error!'
    })
  }

  const handleStakeAll = async () => {
    toast.promise(stakeAll(), {
      loading: 'Staking...',
      success: 'Staked!',
      error: 'Error!'
    })
  }

  const columns = useMemo(() => {
    return [
      {
        Header: 'FC',
        accessor: 'foundercard'
      },
      {
        Header: 'Is stacked',
        accessor: 'status',
        Cell: (c: any) => {
          const row = c?.row?.original
          return <span>{row?.is_staked ? <MdCheck className="text-red" /> : <MdHorizontalRule className="text-red" />}</span>
        }
      },
      {
        Header: 'Balance',
        accessor: 'balance'
      },
      {
        Header: '',
        accessor: 'actions',
        width: 100,
        disableSortBy: true,
        Cell: (c: any) => {
          const row = c?.row?.original
          return (
            <Button
              onClick={() => handleWithdraw(row?.foundercard)}
              size="sm"
              variant="outline"
              className="ml-auto whitespace-nowrap">
              Withdraw All
            </Button>
          )
        }
      }
    ]
  }, [])

  // const totalBalance = useMemo(() => {
  //   if (data) {
  //     return data
  //       .map(({ balance }: { balance: number }) => balance)
  //       .reduce((partial_sum: number, to_add: number) => (partial_sum || 0) + to_add)
  //   }
  //   return null
  // }, [data])

  useEffect(() => {
    const fc = me?.foundersCard
    if (fc && !founderCards) {
      try {
        getFCOwner(parseInt(fc)).then(set_owner)
      } catch (error) {
        console.error(error)
      }
    }
  }, [me, founderCards])

  useEffect(() => {
    if (owner) {
      getFCByOwner(owner).then(setFounderCards)
    }
  }, [owner])

  useEffect(() => {
    if (founderCards && owner) {
      fetchBalances(owner, founderCards).then(setData)
    }
  }, [founderCards, owner])
  return (
    <>
      <FounderCardTableActions onWithdrawAll={handleWithdrawAll} onApproveAll={handleStakeAll} />
      {data && data?.length > 0 && <DataTable columns={columns} data={data} totalData={0} className="min-h-500px" />}
    </>
  )
}
