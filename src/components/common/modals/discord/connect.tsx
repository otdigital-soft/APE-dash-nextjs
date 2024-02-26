'use client'
import { Formik } from 'formik'
import { toast } from 'react-hot-toast'

import { Button } from '@/components/ui'
import { Input } from '@/components/ui/forms/input'
import { useMe } from '@/hooks/use-me'
import { editUser } from '@/restapi/users/mutation'
import { User } from '@/restapi/users/user'

import { Modal, ModalProps } from '../'

interface AddDiscordConnectModalProps extends ModalProps {
  onSuccess?: (data: User.Entity) => void
}

export const AddDiscordConnectModal: React.FC<AddDiscordConnectModalProps> = ({ onClose, onSuccess, show, ...props }) => {
  const { me, mutate } = useMe()

  const handleAddDiscordUsername = async (values: Record<string, any>) => {
    if (!me?._id) {
      toast.error('You need to login first')
      return
    }
    try {
      const editedUser = await editUser(me?._id, {
        discordUsername: values.discordUsername
      })
      onSuccess?.(editedUser?.data)
      mutate?.()
      toast.success('Discord username added successfully.')
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong, please try again later.')
    }
    onClose?.()
  }
  return (
    <Modal show={show} {...props}>
      <Formik
        initialValues={{
          discordUsername: me?.discordUsername || ''
        }}
        onSubmit={handleAddDiscordUsername}>
        {({ values, handleChange, handleBlur, handleSubmit, errors, isSubmitting }) => (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-3 lg:space-y-3">
            <h1 className="text-xl font-semibold">Discord Username</h1>
            <Input
              label="Username"
              placeholder="username"
              name="discordUsername"
              size="sm"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.discordUsername}
              error={errors?.discordUsername}
              required
            />
            <div>
              <div className="flex space-x-3 lg:space-x-5 mt-3">
                <Button type="submit" size="sm" loading={isSubmitting}>
                  Save Changes
                </Button>
                <Button size="sm" variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </Modal>
  )
}
