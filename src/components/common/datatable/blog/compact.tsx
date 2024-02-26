import { MdCancel, MdDelete, MdEdit, MdVerified } from 'react-icons/md'

import { Toggler } from '@/components/ui/forms'

interface BlogCompactTableProps {
  data?: Blog.Data[]
  onDelete?: (blogId: number) => void
  onChangePublishState?: (data: Blog.Data, isPublished: boolean) => void
  onEdit?: (data: Blog.Data) => void
}
export const BlogCompactTable: React.FC<BlogCompactTableProps> = ({ data, onDelete, onChangePublishState, onEdit }) => {
  return (
    <div className="rounded-2xl bg-dark-gray border border-#3A3A3A">
      <h1 className="p-5 border-b border-#3A3A3A">Blog</h1>
      <div className="flex flex-col divide-y divide-#3A3A3A">
        {data?.map((item, index) => (
          <div key={index} className="flex flex-col space-y-3 p-5">
            <div className="flex space-x-3 justify-between">
              <span className="text-white">{item?.title}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit?.(item)}
                  className="w-8 h-8 flex items-center justify-center bg-primary text-primary bg-opacity-10 rounded-full shadow text-center">
                  <MdEdit />
                </button>
                <button
                  onClick={() => onDelete?.(item?.id)}
                  className="w-8 h-8 flex items-center justify-center bg-primary bg-opacity-10 rounded-full shadow">
                  <MdDelete />
                </button>
              </div>
            </div>
            <ul className="flex flex-col space-y-2">
              <li className="flex space-x-3 items-center">
                <span className="text-sm text-white text-opacity-50">Category</span>
                <span>{item?.category.name}</span>
              </li>
              <li className="flex space-x-3 items-center">
                <span className="text-sm text-white text-opacity-50">Website</span>
                <span>{item?.landing_page?.custom_domain}</span>
              </li>
              <li className="flex space-x-3 items-center">
                <span className="text-sm text-white text-opacity-50">Verified</span>
                <div>
                  {item?.is_active ? (
                    <MdVerified className="text-2xl text-green" />
                  ) : (
                    <MdCancel className="text-2xl text-red" />
                  )}
                </div>
              </li>
              <li className="flex space-x-3 items-center">
                <span className="text-sm text-white text-opacity-50">Published</span>
                <Toggler defaultChecked={item?.is_published} onSwitch={(state) => onChangePublishState?.(item, state)} />
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
