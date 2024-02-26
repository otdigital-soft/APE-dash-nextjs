import { Formik } from 'formik'
import { useMemo } from 'react'
import { toast } from 'react-hot-toast'
import { mutate } from 'swr'

import { Button } from '@/components/ui'
import { Input } from '@/components/ui/forms'
import { GET_ALL_ACCOUNT } from '@/restapi/accounts/constants'
import { editAccount } from '@/restapi/accounts/mutation'
import { addAccountSchema } from '@/restapi/accounts/schema'

import { Modal, ModalProps } from '../'

interface EditAccessManagerModalProps extends ModalProps {
  data?: Account.Dto & {
    _id: string
  }
}
export const EditAccessManagerModal: React.FC<EditAccessManagerModalProps> = ({ data, onClose, ...props }) => {
  const handleEditAccount = async (values: any) => {
    if (!data?._id) return
    try {
      const account = await editAccount(data?._id, values)
      if (account) {
        toast.success(account?.message || 'Account created successfully!')
        mutate(GET_ALL_ACCOUNT)
        onClose?.()
      } else {
        toast.error('Something went wrong. Please try again later.')
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Something went wrong. Please try again later.')
    }
  }
  const editAccountInitial = useMemo(() => {
    return {
      websiteKey: data?.websiteKey,
      username: data?.username,
      password: data?.password
    }
  }, [data])
  return (
    <Modal {...props}>
      <Formik initialValues={editAccountInitial} onSubmit={handleEditAccount} validationSchema={addAccountSchema}>
        {({ values, handleChange, handleBlur, handleSubmit, errors, isSubmitting }) => (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-5 lg:px-5 px-3 py-3">
            <h1 className="text-2xl font-semibold">Edit Access Details</h1>
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
                label="Email"
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
            <div className="flex lg:space-x-3 space-x-3">
              <Button type="submit" className="w-1/2" loading={isSubmitting}>
                Edit Account
              </Button>
              <Button className="w-1/2" variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </Modal>
  )
}
