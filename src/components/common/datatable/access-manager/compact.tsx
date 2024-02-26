import { MdDelete, MdEdit } from 'react-icons/md'

import { PasswordMask } from '@/components/ui/forms'

interface AccessManagerCompactTableProps {
  data?: Record<string, any>[]
}
export const AccessManagerCompactTable: React.FC<AccessManagerCompactTableProps> = ({ data }) => {
  return (
    <div className="rounded-2xl bg-dark-gray border border-#3A3A3A">
      <h1 className="p-5 border-b border-#3A3A3A">Website List</h1>
      <div className="flex flex-col divide-y divide-#3A3A3A">
        {data?.map((item, index) => (
          <div key={index} className="flex flex-col space-y-3 p-5">
            <div className="flex space-x-3 justify-between">
              <span className="text-white">{item?.websiteKey}</span>
              <div className="flex space-x-2">
                <button className="w-8 h-8 flex items-center justify-center bg-primary text-primary bg-opacity-10 rounded-full shadow text-center">
                  <MdEdit />
                </button>
                <button className="w-8 h-8 flex items-center justify-center bg-primary bg-opacity-10 rounded-full shadow">
                  <MdDelete />
                </button>
              </div>
            </div>
            <ul className="flex flex-col space-y-2">
              <li className="flex space-x-3 items-center">
                <span className="text-sm text-white text-opacity-50">Username</span>
                <span>{item?.username}</span>
              </li>
              <li className="flex space-x-3 items-center">
                <span className="text-sm text-white text-opacity-50">Password</span>
                <PasswordMask password={item?.password} />
              </li>
              {/* <li className="flex space-x-3 items-center">
                <span className="text-sm text-white text-opacity-50">Verified</span>
                <div>
                  {item?.verified ? (
                    <MdVerified className="text-2xl text-green" />
                  ) : (
                    <MdCancel className="text-2xl text-red" />
                  )}
                </div>
              </li> */}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
