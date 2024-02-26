import { MdCloudUpload, MdCreateNewFolder, MdDriveFolderUpload } from 'react-icons/md'

import { Menu, Transition } from '@headlessui/react'

export const UploadDropdown = () => {
  return (
    <Menu as="div" className="relative flex items-center">
      {({ open }) => (
        <>
          <Menu.Button className="inline-flex items-center justify-center rounded-lg cursor-pointer group h-[42px] w-[42px] hover:bg-dark-gray hover:text-primary">
            <MdCloudUpload className="text-2xl" />
          </Menu.Button>

          {/* Use the `Transition` component. */}
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0">
            <Menu.Items
              static
              className="absolute right-0 z-30 flex flex-col justify-start w-56 py-1 overflow-auto text-base text-left rounded-lg bg-dark-gray shadow-frame max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm top-12 divide-opacity-50">
              <Menu.Item as="span" className="px-5 pt-3 pb-1 text-sm">
                <span className="text-primary">Upload</span>
              </Menu.Item>
              <Menu.Item as="button" className="flex items-center px-5 py-3 space-x-3 hover:bg-dark">
                <MdCloudUpload className="text-xl" />
                <span>Upload Files</span>
              </Menu.Item>
              <Menu.Item as="button" className="flex items-center px-5 py-3 space-x-3 hover:bg-dark">
                <MdDriveFolderUpload className="text-xl" />
                <span>Upload Folder</span>
              </Menu.Item>
              <Menu.Item as="span" className="px-5 pt-3 pb-1 text-sm">
                <span className="text-primary">Create</span>
              </Menu.Item>
              <Menu.Item as="button" className="flex items-center px-5 py-3 space-x-3 hover:bg-dark">
                <MdCreateNewFolder className="text-xl" />
                <span>Create Folder</span>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}
