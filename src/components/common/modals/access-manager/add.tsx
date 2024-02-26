import { Formik } from 'formik'
import { toast } from 'react-hot-toast'
import { mutate } from 'swr'

import { Button } from '@/components/ui'
import { Input } from '@/components/ui/forms'
import { GET_ALL_ACCOUNT } from '@/restapi/accounts/constants'
import { addAccountSchema } from '@/restapi/accounts/schema'
import api from '@/services/api'

import { Modal, ModalProps } from '../'

type AddAccessManagerModalProps = ModalProps
const accountCreationInitial = {
  websiteKey: '',
  username: '',
  password: ''
}

export const AddAccessManagerModal: React.FC<AddAccessManagerModalProps> = ({ onClose, ...props }) => {
  const handleAddAccount = async (values: typeof accountCreationInitial) => {
    await api
      .post(`/accounts`, values)
      .then(({ data }) => {
        toast.success(data?.message || 'Account created successfully!')
        mutate(GET_ALL_ACCOUNT)
        onClose?.()
      })
      .catch((e) => {
        toast.error(e?.response?.data?.message || 'Something went wrong. Please try again later.')
      })
  }
  return (
    <Modal {...props}>
      <Formik initialValues={accountCreationInitial} onSubmit={handleAddAccount} validationSchema={addAccountSchema}>
        {({ values, handleChange, handleBlur, handleSubmit, errors, isSubmitting }) => (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-5 lg:px-5 px-3 py-3">
            <h1 className="text-2xl font-semibold">Add New Access Details</h1>
            <div className="flex flex-col space-y-4">
              <Input
                name="websiteKey"
                label="Website URL"
                placeholder="url"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.websiteKey}
                error={errors?.websiteKey}
              />
              <Input
                name="username"
                label="Identifier (Email / Username)"
                placeholder="Type here"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.username}
                error={errors?.username}
              />
              <Input
                name="password"
                label="Password"
                type="password"
                placeholder="Type here"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.password}
                error={errors?.password}
              />
            </div>
            <div className="flex lg:space-x-8 space-x-3">
              <Button className="w-1/2" variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button type="submit" className="w-1/2" loading={isSubmitting}>
                Add Account
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </Modal>
  )
}
