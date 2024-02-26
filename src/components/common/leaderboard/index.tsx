'use client'

import { toCurrency } from '@/lib/utils'
import { Leaderboard as LeaderboardInterface } from '@/restapi/leaderboard/leaderboard'

import { Avatar } from '../avatar'

const lowestHeight = 248

interface LeaderboardProps {
  data?: LeaderboardInterface[]
}
export const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-3 gap-x-5">
      <div className="flex flex-col space-y-5 justify-end text-center">
        <Avatar className="justify-center" />
        <div
          className="bg-#20CB27 rounded-2xl py-3 px-3 text-center flex flex-col justify-between space-y-4"
          style={{
            height: lowestHeight
          }}>
          <h1 className="font-medium leading-tight">{data?.[2]?.business?.name || data?.[2]?.user?.name}</h1>
          <ul className="flex flex-col space-y-3">
            <li className="flex flex-col space-y-1">
              <span className="text-sm">Active Customer</span>
              <span className="font-bold">{data?.[2]?.activeCustomers || 0}</span>
            </li>
            <li className="flex flex-col space-y-1">
              <span className="text-sm">Revenue</span>
              <span className="font-bold">{toCurrency(data?.[2]?.revenue || 0)}</span>
            </li>
            {/* <li className="flex flex-col space-y-1">
              <span className="text-sm">Influence </span>
              <span className="font-bold">{data?.[2]?.influence}</span>
            </li> */}
          </ul>
        </div>
        <span
          className="text-transparent text-8xl"
          style={{
            WebkitTextStroke: '1px rgba(255,255,255,.1)'
          }}>
          3
        </span>
      </div>
      <div className="flex flex-col space-y-5 justify-end text-center">
        <Avatar className="justify-center" />
        <div
          className="bg-primary rounded-2xl py-3 px-3 text-center flex flex-col space-y-4 justify-between"
          style={{
            height: lowestHeight * 1.6
          }}>
          <h1 className="font-medium leading-tight mb-4">{data?.[0]?.business?.name || data?.[0]?.user?.name}</h1>
          <ul className="flex flex-col space-y-3">
            <li className="flex flex-col space-y-1">
              <span className="text-sm">Active Customer</span>
              <span className="font-bold">{data?.[0]?.activeCustomers || 0}</span>
            </li>
            <li className="flex flex-col space-y-1">
              <span className="text-sm">Revenue</span>
              <span className="font-bold">{toCurrency(data?.[0]?.revenue || 0)}</span>
            </li>
            {/* <li className="flex flex-col space-y-1">
              <span className="text-sm">Influence </span>
              <span className="font-bold">{data?.[0]?.influence || 0}</span>
            </li> */}
          </ul>
        </div>
        <span
          className="text-transparent text-8xl"
          style={{
            WebkitTextStroke: '1px rgba(255,255,255,.5)'
          }}>
          1
        </span>
      </div>
      <div className="flex flex-col space-y-5 justify-end text-center">
        <Avatar className="justify-center" />
        <div
          className="bg-#826AF9 rounded-2xl py-3 px-3 text-center flex flex-col space-y-4 justify-between"
          style={{
            height: lowestHeight * 1.3
          }}>
          <h1 className="font-medium leading-tight">{data?.[1]?.business?.name || data?.[1]?.user?.name}</h1>
          <ul className="flex flex-col space-y-3">
            <li className="flex flex-col space-y-1">
              <span className="text-sm">Active Customer</span>
              <span className="font-bold">{data?.[1]?.activeCustomers}</span>
            </li>
            <li className="flex flex-col space-y-1">
              <span className="text-sm">Revenue</span>
              <span className="font-bold">{toCurrency(data?.[1]?.revenue || 0)}</span>
            </li>
            {/* <li className="flex flex-col space-y-1">
              <span className="text-sm">Influence </span>
              <span className="font-bold">{data?.[1]?.influence || 0}</span>
            </li> */}
          </ul>
        </div>
        <span
          className="text-transparent text-8xl"
          style={{
            WebkitTextStroke: '1px rgba(255,255,255,.3)'
          }}>
          2
        </span>
      </div>
    </div>
  )
}
