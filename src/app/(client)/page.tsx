// import { getServerSession } from 'next-auth'

import { OverviewCharts } from '@/components/charts'
import { AllGrowthChart } from '@/components/charts/all-growth'

// import { authOptions } from '@/services/auth'

const Home = async () => {
  return (
    <main className="flex flex-col space-y-5">
      <h1 className="block lg:hidden text-3xl mb-5">Dashboard</h1>
      <AllGrowthChart />
      <OverviewCharts />
    </main>
  )
}

export default Home
