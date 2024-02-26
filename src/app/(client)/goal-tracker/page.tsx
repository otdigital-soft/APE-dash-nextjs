import { GoalTrackerGrowth } from '@/components/charts/goal-tracker/growth-line'
import { GoalTrackerHistoryTable } from '@/components/common/datatable/goal-tracker'
import { GoalTracker } from '@/components/common/goal-tracker'

const GoalTrackerPage = async () => {
  return (
    <main className="flex flex-col space-y-5">
      <h1 className="block lg:hidden text-3xl mb-5">Goal Tracker</h1>
      <div className="flex space-x-3">
        <div className="p-5 rounded-xl bg-dark-gray w-1/3 h-fit">
          <GoalTracker />
        </div>
        <div className="w-2/3 flex flex-col space-y-4">
          <div className="rounded-xl bg-dark-gray ">
            <GoalTrackerGrowth />
          </div>
          <div className="rounded-xl bg-dark-gray p-5">
            <h2 className="text-lg mb-4">Goal History</h2>
            <GoalTrackerHistoryTable />
          </div>
        </div>
      </div>
    </main>
  )
}

export default GoalTrackerPage
