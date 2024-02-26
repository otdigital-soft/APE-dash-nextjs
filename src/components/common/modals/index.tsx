import { Fragment } from 'react'
import { MdClose } from 'react-icons/md'

import { Dialog, Transition } from '@headlessui/react'

export interface ModalProps {
  show: boolean
  onClose?: () => void
  width?: string
  hideClose?: boolean
  children?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ show, onClose, width = '32rem', hideClose, children }) => {
  return (
    <Transition appear show={show} as={Fragment}>
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
            <Dialog.Overlay className="fixed inset-0 bg-dark bg-opacity-70 backdrop-blur-sm" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block max-h-screen" aria-hidden="true">
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
            <div
              className="relative inline-block w-full overflow-hidden text-left align-middle transition-all border rounded-xl shadow-lg bg-dark-gray border-dark p-5 max-w-full mt-10"
              style={{
                width
              }}>
              {children}
              {!hideClose && (
                <button type="button" className="absolute right-1 top-1" onClick={() => onClose && onClose()}>
                  <MdClose width={24} />
                </button>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
