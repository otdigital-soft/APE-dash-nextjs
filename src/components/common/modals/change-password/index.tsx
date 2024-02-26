'use client'

import { ChangePasswordForm } from '@/components/forms/profile/change-password'
import { User } from '@/restapi/users/user'

import { Modal, ModalProps } from '../'

interface ChangePasswordModalProps extends ModalProps {
  onSuccess?: (data: User.Entity) => void
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose, onSuccess, show, ...props }) => {
  return (
    <Modal show={show} onClose={onClose} {...props}>
      <ChangePasswordForm
        onSuccess={(data) => {
          onSuccess?.(data)
          onClose?.()
        }}
      />
    </Modal>
  )
}
