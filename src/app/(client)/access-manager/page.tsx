import { AccessManagerTable } from '@/components/common/datatable/access-manager'

export default function AccessManager() {
  return (
    <main className="flex flex-col space-y-5 mt-5">
      <h1 className="block lg:hidden text-3xl mb-5">Revenue Stats</h1>
      <AccessManagerTable />
    </main>
  )
}
