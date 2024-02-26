import moment from 'moment'
import Image from 'next/image'
import { FormEvent, Fragment, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { MdClose, MdEdit } from 'react-icons/md'
import { mutate } from 'swr'

import { Button } from '@/components/ui'
import { Input } from '@/components/ui/forms'
import { formatBytes } from '@/lib/utils'
import api from '@/services/api'
import { fetchUrlState } from '@/stores/file-manager/fetch-url'
import { Dialog, Transition } from '@headlessui/react'
import { useHookstate } from '@hookstate/core'

interface EditFileModalProps {
  open?: boolean
  onClose?: () => void
  data?: FileManager.File & FileManager.Folder
  folder?: string
}
const manipulateFolder = (folder?: string) => {
  if (!folder) return ''

  let result = folder
  if (folder && !folder.endsWith('/')) {
    result = folder + '/'
  }
  // if folder is start with /, remove it
  if (folder.startsWith('/')) {
    result = folder.substring(1)
  }
  return result
}
export const EditFileModal: React.FC<EditFileModalProps> = ({ open, onClose, data, folder: initialFolder }) => {
  const fetchUrl = useHookstate(fetchUrlState)
  const [loading, setLoading] = useState(false)

  const handleUploadFile = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    if (!data?.Url) {
      toast.error('No file selected.')
      return
    }
    const formData = new FormData(evt.currentTarget)
    let folder = formData.get('folder')?.toString() || ''
    let name = formData.get('name')?.toString()

    // if name is not with extension, add it
    if (name && !name.includes('.')) {
      name = name + '.' + data?.Key?.split('.').pop()
    }
    folder = manipulateFolder(folder)
    const initFolder = manipulateFolder(initialFolder)

    const key = folder + name
    const oldKey = initFolder + data?.Key
    setLoading(true)
    return await api
      .patch(`/files`, { oldKey, key })
      .then(({ data }) => {
        toast.success(data?.message)
        mutate(fetchUrl.get())
        onClose?.()
      })
      .catch(() => {
        toast.error('Something went wrong. Please try again later.')
      })
      .finally(() => {
        setLoading(false)
      })
  }
  useEffect(() => {
    return () => {
      onClose?.()
    }
  }, [onClose])
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
                      <MdEdit className="text-xl" />
                    </div>
                    <b className="text-base font-bold">Edit File</b>
                  </div>
                </div>
                <div className="flex items-center mt-5 space-x-3">
                  <div className="w-20">
                    {data?.Url && (
                      <Image src={data?.Url} width={80} height={80} className="object-cover rounded-lg" alt={data?.Key} />
                    )}
                  </div>
                  <div className="pl-2">
                    <b
                      className="block overflow-hidden text-sm mb-0.5 text-ellipsis whitespace-nowrap hover:underline"
                      style={{ maxWidth: 240 }}>
                      {data?.Key}
                    </b>
                    <div className="flex items-center">
                      <small className="block text-xs text-gray-500">
                        {formatBytes(data?.Size || 0)}, {moment().format('DD. MMM. YYYY, HH:mm')}
                      </small>{' '}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col mt-3 space-y-3">
                  <Input label="Edit Name" name="name" defaultValue={data?.Key} />
                  <Input
                    label="Folder"
                    name="folder"
                    hint="Save to existing folder or create a new one, separate it with /. Example: images/avatar."
                    defaultValue={initialFolder}
                  />
                </div>
                <div className="flex mt-3">
                  <Button type="submit" text="Edit File" variant="outline" disabled={loading} loading={loading} />
                  <Button text="Cancel" variant="none" className="text-sm hover:underline" onClick={() => onClose?.()} />
                </div>
              </form>
              <button type="button" className="absolute right-5 top-3" onClick={() => onClose && onClose()}>
                <MdClose width={24} />
              </button>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
