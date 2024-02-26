'use client'
import { toast } from 'react-hot-toast'
import { MdContentCopy, MdDownload } from 'react-icons/md'

interface FileActionProps {
  src: string
}

export const handleCopyToClipboard = (text?: string) => {
  if (!text) {
    toast.error('Nothing to copy.')
    return
  }
  navigator.clipboard.writeText(text)

  toast.success('Copied to clipboard')
}

export const FileAction: React.FC<FileActionProps> = ({ src }) => {
  const downloadFile = (url?: string) => {
    if (!url) return
    const link = document.createElement('a')
    link.href = url
    link.download = 'Download.jpg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="absolute right-3 top-3 flex space-x-2">
      <button
        onClick={() => downloadFile(src)}
        className="w-8 h-8 flex items-center justify-center bg-primary bg-opacity-10 rounded-full">
        <MdDownload />
      </button>
      <button
        onClick={() => handleCopyToClipboard(src)}
        className="w-8 h-8 flex items-center justify-center bg-primary bg-opacity-10 rounded-full">
        <MdContentCopy />
      </button>
    </div>
  )
}
