import { Purchases } from '@/components/common/purchases'
import { Subscription } from '@/components/products'

export default function AutoPilotPage() {
  return (
    <main className="flex flex-col space-y-7 my-5">
      <h1 className="block lg:hidden text-3xl mb-5">AutoPilot</h1>

      <div
        className="text-center py-6 rounded-xl flex flex-col space-y-5 lg:px-12 xl:px-16 px-5"
        style={{
          background: 'linear-gradient(91.7deg, rgba(130, 106, 249, .1) -3.62%, rgba(205, 157, 67, .1) 103.46%)'
        }}>
        <h1 className="text-3xl font-bold">Auto Pilot</h1>
        <p className="text-sm text-opacity-70">
          If you&apos;d like our help growing your organic marketing, you can do that here. We will also be releasing
          additional AutoPilot services to help grow your business in the background.
        </p>
      </div>
      <div className="flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-7">
        <div className="flex flex-col space-y-7 flex-1">
          {/* <Flatrate className="flex-1" /> */}
          <Subscription />
        </div>
        <Purchases className="flex-1 h-fit" />
      </div>
    </main>
  )
}
