'use client'

import { AddTeamMemberForm } from '@/components/forms/team/add'
import { EditTeamMemberForm } from '@/components/forms/team/edit'
import { User } from '@/restapi/users/user'

import { Modal, ModalProps } from '../'

interface ManageTeamMemberProps extends ModalProps {
  type?: 'add' | 'edit'
  data?: User.Entity
  onSuccess?: (data: User.Entity) => void
}

export const ManageTeamMember: React.FC<ManageTeamMemberProps> = ({
  type = 'add',
  onClose,
  onSuccess,
  show,
  data,
  ...props
}) => {
  const successCb = async (data: User.Entity) => {
    onSuccess?.(data)
    onClose?.()
  }
  return (
    <Modal show={show} onClose={onClose} width="48rem" {...props}>
      {type === 'add' ? (
        <AddTeamMemberForm onSuccess={successCb} />
      ) : (
        <EditTeamMemberForm onSuccess={successCb} data={data} />
      )}
    </Modal>
  )
}
