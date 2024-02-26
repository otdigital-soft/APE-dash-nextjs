import { useMemo } from 'react'

import { FolderIcon } from '@/components/common'

interface DefaultFileThumbnailProps {
  filename?: string
}
export const DefaultFileThumbnail: React.FC<DefaultFileThumbnailProps> = ({ filename }) => {
  const ext = useMemo(() => {
    if (!filename) return 'File'
    const ext = filename.split('.').pop()
    return ext?.toLowerCase()
  }, [filename])
  return (
    <div className="z-0 flex items-center justify-center mt-5 mb-10 transform scale-125 lg:mb-12 lg:mt-6 lg:scale-150">
      <span className="absolute inline-block mx-auto mt-1 overflow-hidden font-semibold text-center text-theme z-[5] w-7 text-ellipsis text-[9px]">
        {ext}
      </span>
      <div className="text-gray-800">
        <FolderIcon />
      </div>
    </div>
  )
}

interface SmallFileThumbnailProps {
  filename?: string
  width?: number
  height?: number
}
export const SmallFileThumbnail: React.FC<SmallFileThumbnailProps> = ({ filename = '.pdf', width = 38, height = 51 }) => {
  return (
    <div className="flex items-center justify-center pr-2">
      <span className="absolute inline-block mx-auto overflow-hidden font-semibold text-center text-theme z-[5] w-7 text-ellipsis text-[9px]">
        {filename?.split('.').pop()}
      </span>
      <svg
        width={width}
        height={height}
        fill="currentColor"
        viewBox="0 0 38 51"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-100 vue-feather dark:text-gray-800 ">
        <path d="M22.1666667,13.546875 L22.1666667,0 L2.375,0 C1.05885417,0 0,1.06582031 0,2.390625 L0,48.609375 C0,49.9341797 1.05885417,51 2.375,51 L35.625,51 C36.9411458,51 38,49.9341797 38,48.609375 L38,15.9375 L24.5416667,15.9375 C23.2354167,15.9375 22.1666667,14.8617187 22.1666667,13.546875 Z M38,12.1423828 L38,12.75 L25.3333333,12.75 L25.3333333,0 L25.9369792,0 C26.5703125,0 27.1739583,0.249023438 27.6192708,0.697265625 L37.3072917,10.4589844 C37.7526042,10.9072266 38,11.5148437 38,12.1423828 Z"></path>
      </svg>
    </div>
  )
}
