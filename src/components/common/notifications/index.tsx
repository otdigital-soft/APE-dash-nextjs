import { MdClose } from 'react-icons/md'

import { Button } from '@/components/ui'
import { useNotifications } from '@/hooks/use-notifications'
import { Notification as NotificationProps } from '@/hooks/use-websocket'

import { Dropdown } from '../dropdown'
import { NotificationIcon } from '../icons'
import Link from 'next/link'

const NotificationItem = ({
  notification,
  handleRemoveItem,
  id
}: {
  notification: NotificationProps
  handleRemoveItem: (id: string, notification: any) => void
  id: string
}) => {
  return (
    <div className="flex justify-between items-start px-2 py-1 border-l border-primary text-white items-center">
      <div style={{ maxWidth: '250px' }}>
        <p className="font-bold text-base">{notification.title}</p>
        <p className="text-slate-300 text-sm ">
          {notification?.content?.length > 25 ? `${notification.content?.slice(0, 25)} ...` : notification.content}
        </p>
      </div>
      <div className="pl-4 cursor-pointer" onClick={() => handleRemoveItem(id, notification)}>
        <MdClose />
      </div>
    </div>
  )
}

export const Notification: React.FC = () => {
  const { notifications, readNotification } = useNotifications()
  return (
    <Dropdown
      el={
        <Button rounded="full" variant="none" className="relative flex items-center text-gray hover:text-white px-2 py-2">
          <NotificationIcon width={28} height={28} />
          {notifications?.length !== 0 && (
            <span className="absolute -right-1 top-0 w-5 h-5 leading-[22px] text-primary bg-dark-gray rounded-full p-0 pointer-events-none ">
              {notifications?.filter((item) => !item.status).length}
            </span>
          )}
        </Button>
      }
      containerClass="text-white"
      dropdownClass="!w-max"
      chevronClass="right-2"
      variant="dark-gray"
      hideCarret
      status={notifications?.filter((item) => !item.status).length > 0}
      hideChevron>
      <div className="flex flex-col space-y-1 py-2 px-2">
        {notifications
          .filter((item) => !item.status)
          .map((notification, index: number) => (
            <NotificationItem
              key={index}
              id={notification._id}
              notification={notification}
              handleRemoveItem={() => readNotification(notification._id, index)}
            />
          ))}
        <a href="/notifications" className="text-right mt-10">
          see all
        </a>
      </div>
    </Dropdown>
  )
}
