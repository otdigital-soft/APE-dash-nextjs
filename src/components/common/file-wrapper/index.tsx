import Image from 'next/image'
import { useMemo } from 'react'

import { FileAction } from './action'

interface FileWrapperProps {
  noDownload?: boolean
  noCopy?: boolean
  previewSource?: string
  src: string
  width?: number
  height?: number
  fileID?: string
  filename?: string
  eTag?: string
}
export const FileWrapper: React.FC<FileWrapperProps> = ({
  src,
  width = 150,
  height = 64,
  previewSource,
  noCopy,
  noDownload,
  fileID,
  filename,
  eTag
}) => {
  const source = useMemo(() => {
    if (previewSource) {
      return previewSource
    }
    return src
  }, [src, previewSource])
  const showActions = useMemo(() => {
    return !noCopy || !noDownload
  }, [noCopy, noDownload])

  const showInfo = useMemo(() => {
    return fileID || filename || eTag
  }, [fileID, filename, eTag])

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-center items-center relative h-200px bg-dark rounded-2xl">
        <Image
          src={source}
          alt=""
          width={width}
          height={height}
          className="object-contain"
          style={{
            width,
            height
          }}
        />
        {showActions && <FileAction src={src} />}
      </div>
      {showInfo && (
        <ul className="flex flex-col space-y-1">
          {fileID && (
            <li className="flex space-x-3">
              <span className="text-sm text-white text-opacity-40">File ID</span>
              <span className="text-sm">{fileID}</span>
            </li>
          )}
          {filename && (
            <li className="flex space-x-3">
              <span className="text-sm text-white text-opacity-40">Filename</span>
              <span className="text-sm">{filename}</span>
            </li>
          )}
          {eTag && (
            <li className="flex space-x-3">
              <span className="text-sm text-white text-opacity-40">ETag</span>
              <span className="text-sm">{eTag}</span>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
