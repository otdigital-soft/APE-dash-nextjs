import { ChangeEvent, useState } from 'react'
import { toast } from 'react-hot-toast'

import { Button } from '@/components/ui'

import { UploadModal } from '../../misc/upload-modal'

interface UploadFileProps {
  initialFolder?: string
}
export const UploadFile: React.FC<UploadFileProps> = ({ initialFolder }) => {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [preview, setPreview] = useState<string>()
  const [files, setFiles] = useState<FileList>()

  const handleFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files?.[0]) {
      toast.error('No files selected.')
      return
    }
    setShowUploadModal(true)
    if (evt.target.files.length == 1) {
      const objectUrl = URL.createObjectURL(evt.target.files?.[0])
      setPreview(objectUrl)
    } else {
      setPreview(undefined)
    }
    setFiles(evt.target.files)
  }

  return (
    <div>
      <label
        htmlFor="upload"
        className="flex items-center justify-center rounded-lg relative cursor-pointer group hover:bg-dark-gray hover:text-primary">
        <Button>Upload</Button>
        <input
          id="upload"
          type="file"
          className="h-full w-full absolute top-0 left-0 opacity-0 cursor-pointer"
          onChange={handleFileChange}
          multiple
        />
      </label>
      <UploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        data={{
          preview,
          files
        }}
        initialFolder={initialFolder}
      />
    </div>
  )
}
