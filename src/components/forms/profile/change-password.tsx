import { Formik } from 'formik'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui'
import { Input } from '@/components/ui/forms'
import { useMe } from '@/hooks/use-me'
import { editUser } from '@/restapi/users/mutation'
import { User } from '@/restapi/users/user'

import { editProfileSchema } from './profile.schema'

interface ChangePasswordFormProps {
  onSuccess?: (data: User.Entity) => void
}
export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSuccess }) => {
  const { me, mutate } = useMe()
  const onSubmit = async (values: Record<string, any>) => {
    try {
      // wait user to be ready
      if (!me?._id) {
        return
      }

      // revalidate confirm password
      if (values?.password && values?.password !== values?.confirmPassword) {
        toast.error('Password and confirm password does not match.')
        return
      }
      // update profile
      const action = await editUser(me?._id, {
        currentPassword: values?.currentPassword,
        newPassword: values?.password
      })
      if (action?.data?._id) {
        toast.success('Password changed successfully.')
        onSuccess?.(action?.data)
        mutate()
      }
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong, please try again later.')
    }
  }

  const values = useMemo(() => {
    return {
      currentPassword: '',
      password: '',
      confirmPassword: ''
    }
  }, [])
  return (
    <Formik initialValues={values} validationSchema={editProfileSchema} onSubmit={onSubmit} enableReinitialize>
      {({ values, handleChange, handleBlur, handleSubmit, errors, isSubmitting }) => (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3 lg:space-y-3">
          <h1 className="text-xl font-semibold mb-3">{me?.noPassword ? 'Create Password' : 'Change Password'}</h1>

          {!me?.noPassword && (
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter your current password"
              name="currentPassword"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.currentPassword}
              error={errors?.currentPassword}
            />
          )}
          <Input
            label="New Password"
            type="password"
            placeholder="Enter your new password"
            name="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values?.password}
            error={errors?.password}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your new password"
            name="confirmPassword"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values?.confirmPassword}
            error={errors?.confirmPassword}
          />
          <div className="flex space-x-3 items-center">
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      )}
    </Formik>
  )
}
