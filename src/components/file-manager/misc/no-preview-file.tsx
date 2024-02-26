import { FiEyeOff } from 'react-icons/fi'

export const NoPreviewFile: React.FC = () => {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        height: 'calc(100vh - 120px - 44px)'
      }}>
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <FiEyeOff className="text-2xl" />
        <span className="block text-xs text-gray-500">There is nothing to preview.</span>
      </div>
    </div>
  )
}
