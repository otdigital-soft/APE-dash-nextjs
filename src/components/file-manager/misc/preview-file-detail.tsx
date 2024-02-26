import moment from 'moment'
import Image from 'next/image'
import { useMemo } from 'react'
import { FiCheckSquare, FiImage } from 'react-icons/fi'
import { MdPictureAsPdf } from 'react-icons/md'

import { formatBytes, getExt, getFilename } from '@/lib/utils'
import { selectedFilesState } from '@/stores/file-manager/selected-files'
import { useHookstate } from '@hookstate/core'

const MultipleFilePreview: React.FC<{
  filesCount?: number
}> = ({ filesCount }) => {
  return (
    <div className="flex items-start mb-6">
      <div className="mr-2 text-xl text-primary">
        <FiCheckSquare />
      </div>
      <div>
        <b className="block overflow-hidden text-sm font-bold w-52 text-ellipsis whitespace-nowrap 2xl:w-72">
          Selected Multiple Items
        </b>
        <small className="block text-xs font-bold text-gray-400">{filesCount || 0} Items</small>
      </div>
    </div>
  )
}
export const PreviewFileDetail: React.FC = () => {
  const selectedFiles = useHookstate(selectedFilesState)
  const file = Object.values(
    selectedFiles.get({
      noproxy: true
    }) || {}
  )?.[0]

  const filesCount = useMemo(() => {
    return Object.keys(selectedFiles.get() || {})?.length
  }, [selectedFiles])

  if (filesCount > 1) {
    return <MultipleFilePreview filesCount={filesCount} />
  }
  return (
    <div
      className="flex flex-col mb-6"
      style={{
        height: 'calc(100vh - 120px - 44px)'
      }}>
      {file?.Url && (
        <div className="relative block w-full mb-4">
          <Image
            alt={file.Key || ''}
            src={file?.Url}
            width={275}
            height={275}
            className="object-cover w-full overflow-hidden rounded-lg shadow-lg"
          />
        </div>
      )}
      <div className="flex items-start mb-6">
        <div className="mr-2 text-xl text-primary">
          {getExt(file?.Key) === 'png' || getExt(file?.Key) === 'jpg' || (getExt(file?.Key) === 'jpeg' && <FiImage />)}
          {getExt(file?.Key) === 'pdf' && <MdPictureAsPdf />}
        </div>
        <div>
          <b className="block overflow-hidden text-sm font-bold w-52 text-ellipsis whitespace-nowrap 2xl:w-72">
            {getFilename(file.Key)}
          </b>
          <small className="block text-xs font-bold text-gray-400">{getExt(file.Key)}</small>
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <div>
          <small className="block text-xs font-bold text-primary">Size</small>
          <b className="inline-block text-sm font-semibold">{formatBytes(file.Size || 0)}</b>
        </div>
        <div>
          <small className="block text-xs font-bold text-primary">Created At</small>
          <b className="inline-block text-sm font-semibold">{moment().format('DD. MMM. YYYY, HH:mm')}</b>
        </div>
      </div>
    </div>
  )
}
