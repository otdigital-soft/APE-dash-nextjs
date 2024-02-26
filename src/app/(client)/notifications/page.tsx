import { NotificationHistoryTable } from '@/components/common/datatable/notification'

const NotificationsPage = async () => {
  return (
    <main className="flex flex-col space-y-5">
      <div className="rounded-xl bg-dark-gray p-5">
        <h2 className="text-lg mb-4">All Notifications</h2>
        <NotificationHistoryTable />
      </div>
    </main>
  )
}

export default NotificationsPage
