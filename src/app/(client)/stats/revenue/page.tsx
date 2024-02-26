import { ChurnRate, GrowthChart, RevenueChart, RevenueStats } from '@/components/charts'
import { RecentTransactions } from '@/components/common/recent-transactions'

export default function Home() {
  return (
    <main className="flex flex-col space-y-5 py-5">
      <h1 className="block lg:hidden text-3xl mb-5">Revenue Stats</h1>
      <RevenueStats />
      <div className="flex lg:space-x-5 space-y-5 lg:space-y-0 lg:flex-row flex-col">
        <div className="lg:w-8/12">
          <RevenueChart />
        </div>
        <div className="lg:w-4/12">
          <ChurnRate />
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-y-5 lg:gap-y-0 lg:gap-x-5">
        <GrowthChart />
        <RecentTransactions />
      </div>
    </main>
  )
}
