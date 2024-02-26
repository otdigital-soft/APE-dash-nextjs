import clsx from 'clsx'
import moment from 'moment'
import Image from 'next/image'
import { FormEvent, Fragment, useState } from 'react'
import { toast } from 'react-hot-toast'
import { MdUpload } from 'react-icons/md'
import { mutate } from 'swr'

import { Button } from '@/components/ui'
import { Input } from '@/components/ui/forms'
import { useMe } from '@/hooks/use-me'
import { sumFormatBytes } from '@/lib/utils'
import api from '@/services/api'
import { fetchUrlState } from '@/stores/file-manager/fetch-url'
import { Dialog, Transition } from '@headlessui/react'
import { useHookstate } from '@hookstate/core'

interface UploadModalProps {
  open?: boolean
  onClose?: () => void
  data?: {
    preview?: string
    files?: FileList
  }
  initialFolder?: string
}
export const UploadModal: React.FC<UploadModalProps> = ({ open, onClose, data, initialFolder }) => {
  const [uploading, setUploading] = useState(false)
  const { me } = useMe()
  const fetchUrl = useHookstate(fetchUrlState)
  const files = Array.from(data?.files || [])

  const uploadFile = async (file: File, count: number, folder: string, defaultName?: string) => {
    const body = new FormData()
    let name = defaultName
    if (count > 1) {
      name = file.name
    }

    // if name is not with extension, add it
    if (name && !name.includes('.')) {
      name = name + '.' + file?.name.split('.').pop()
    }
    // if folder is not ending with /, add it
    if (folder && !folder.endsWith('/')) {
      folder = folder + '/'
    }
    // if folder is start with /, remove it
    if (folder.startsWith('/')) {
      folder = folder.substring(1)
    }

    const key = folder + name

    body.append('file', file)
    body.append('filename', key)
    body.append('user', me?._id || '')

    setUploading(true)
    // return true
    return await api
      .post('/files/upload', body, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(() => true)
      .catch(() => false)
  }
  const handleUploadFile = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    if (!data?.files) {
      toast.error('No file selected.')
      return
    }

    const formData = new FormData(evt.currentTarget)
    const folder = formData.get('folder')?.toString() || ''
    const name = formData.get('name')?.toString()

    let successCount = 0
    toast.loading(`Uploading 1/${files.length} files...`, {
      id: 'upload'
    })
    for (let i = 0; i < data?.files?.length; i++) {
      const uploadSuccess = await uploadFile(data?.files?.[i], data?.files.length, folder, name)
      if (uploadSuccess) {
        successCount++
      }
      toast(`Uploading ${files.length - i}/${files.length} files...`, {
        id: 'upload'
      })
    }
    toast.success(`Uploaded ${files.length} files. ${successCount} successful.`, {
      id: 'upload'
    })
    mutate(fetchUrl.get())
    onClose?.()
    setUploading(false)
  }
  // useEffect(() => {
  //   return () => {
  //     onClose?.()
  //   }
  // }, [onClose])
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={() => onClose && onClose()}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-dark bg-opacity-10 backdrop-blur-sm" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <div className="relative inline-block px-6 pt-6 pb-6 overflow-hidden text-left align-middle transition-all transform rounded-lg bg-dark-gray md:w-[490px]">
              <form onSubmit={handleUploadFile}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3">
                      <MdUpload className="text-xl" />
                    </div>
                    <b className="text-base font-bold">File Preview</b>
                  </div>
                </div>
                <div className={clsx('flex mt-5', files.length > 1 ? 'flex-col' : 'space-x-3 items-center')}>
                  {files?.length > 1 ? (
                    <p>Uploading {files.length} files</p>
                  ) : (
                    <div className="w-20">
                      {data?.preview && (
                        <Image
                          src={data?.preview}
                          alt={data?.preview}
                          width={80}
                          height={80}
                          className="object-cover rounded-lg"
                        />
                      )}
                    </div>
                  )}
                  <div className={files.length > 1 ? '' : 'pl-2'}>
                    {files?.length == 1 && (
                      <b
                        className="block overflow-hidden text-sm mb-0.5 text-ellipsis whitespace-nowrap hover:underline"
                        style={{ maxWidth: 240 }}>
                        {files?.[0]?.name}
                      </b>
                    )}
                    <div className="flex items-center">
                      <small className="block text-xs text-gray-500">
                        {sumFormatBytes(files.map((v) => v.size || 0))}, {moment().format('DD. MMM. YYYY, HH:mm')}
                      </small>{' '}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col mt-3 space-y-3">
                  {files.length === 1 && <Input label="Edit Name" name="name" defaultValue={files?.[0]?.name} />}
                  <Input
                    label="Folder (optional)"
                    name="folder"
                    hint="Save to existing folder or create a new one, separate it with /. Example: images/avatar."
                    defaultValue={initialFolder}
                  />
                </div>
                <div className="flex mt-3">
                  <Button
                    type="submit"
                    text={files.length === 1 ? 'Upload File' : `Upload ${files.length} files`}
                    variant="outline"
                    loading={uploading}
                    disabled={uploading}
                  />
                  <Button text="Cancel" variant="none" className="text-sm hover:underline" onClick={() => onClose?.()} />
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
