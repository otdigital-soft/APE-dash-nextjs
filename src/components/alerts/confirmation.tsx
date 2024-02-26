'use client'
import { ComponentType, Fragment, useRef, useState } from 'react'
import { confirmable, createConfirmation, ReactConfirmProps } from 'react-confirm'
import { MdWarning } from 'react-icons/md'

import { Button } from '@/components/ui'
import { Dialog, Transition } from '@headlessui/react'

interface ConfirmProps {
  proceedLabel?: string
  cancelLabel?: string
  title?: string
  confirmation?: string
  show?: boolean
  proceed?: (state?: boolean) => void
  enableEscape?: boolean
}

const Confirmation: ComponentType<ReactConfirmProps & ConfirmProps> = ({
  proceedLabel = 'OK',
  cancelLabel = 'Cancel',
  title = 'Confirmation',
  confirmation,
  show,
  proceed
}) => {
  const [open, setOpen] = useState(show)

  const cancelButtonRef = useRef(null)

  const handleProceed = (state: boolean) => {
    proceed && proceed(state)
    setOpen(false)
  }
  // useEffect(() => {
  //   const modal = new bootstrap.Modal(modalRef?.current || '')
  //   if (show) {
  //     modal.show()
  //   } else {
  //     modal.hide()
  //   }
  // }, [show])
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 transition-opacity bg-opacity-75 bg-dark" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-full p-4 text-center items-center p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform rounded-lg border border-#3a3a3a shadow-xl bg-dark sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto rounded-full bg-dark sm:mx-0 sm:h-10 sm:w-10">
                    <MdWarning className="text-xl text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 ">
                      {title}
                    </Dialog.Title>
                    <div className="mt-2 text-sm text-gray-400">{confirmation}</div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:ml-10 flex sm:pl-4">
                  {proceedLabel && (
                    <Button variant="outline" onClick={() => handleProceed(true)} className="px-6 bg-danger" size="sm">
                      {proceedLabel}
                    </Button>
                  )}

                  <button
                    type="button"
                    className="inline-flex justify-center w-full py-2 text-sm lg:text-base font-medium hover:underline sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm focus-visible:outline-none"
                    onClick={() => handleProceed(false)}
                    ref={cancelButtonRef}>
                    {cancelLabel}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export function confirm(
  confirmation: string,
  proceedLabel = 'OK',
  cancelLabel = 'Cancel',
  options: Record<string, unknown> = {}
) {
  return createConfirmation(confirmable(Confirmation))({
    confirmation,
    proceedLabel,
    cancelLabel,
    ...options
  })
}
