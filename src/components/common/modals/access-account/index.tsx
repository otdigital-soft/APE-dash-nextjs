'use client'
import { useState } from 'react'

import { Modal, ModalProps } from '../'
import { Input } from '@/components/ui/forms'

interface AccessAccountModalProps extends ModalProps {
  onConfirm?: any
  onChangeInput?: any
}

export const AccessAccountModal: React.FC<AccessAccountModalProps> = ({
  onClose,
  onConfirm,
  onChangeInput,
  show,
  ...props
}) => {
  const handleCredentialChange = (e: any) => {
    onChangeInput(e.target.value)
  }
  return (
    <Modal show={show} onClose={onClose} {...props}>
      <Input type="password" onChange={handleCredentialChange} />
      <div className="mt-4">
        <button className="block ml-auto py-3 px-5" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </Modal>
  )
}
