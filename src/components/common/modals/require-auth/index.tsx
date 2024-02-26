'use client'

import { RequireAuthForm } from '@/components/forms/auth/require-auth'
import { User } from '@/restapi/users/user'

import { Modal, ModalProps } from '../'

interface RequireAuthModalProps extends ModalProps {
  onSuccess?: (data: User.Entity) => void
}

export const RequireAuthModal: React.FC<RequireAuthModalProps> = ({ onClose, onSuccess, show, ...props }) => {
  return (
    <Modal show={show} onClose={onClose} {...props}>
      <RequireAuthForm
        onSuccess={(data) => {
          onSuccess?.(data)
          onClose?.()
        }}
        onCancel={onClose}
      />
    </Modal>
  )
}
