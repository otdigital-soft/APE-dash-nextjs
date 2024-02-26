'use client'
import { Formik } from 'formik'
import { useMemo, useState } from 'react'
import { MdEdit } from 'react-icons/md'

import { ChangePasswordModal } from '@/components/common/modals/change-password'
import { Button } from '@/components/ui'
import { Loading } from '@/components/ui/button'
import { Input } from '@/components/ui/forms'
import { useMe } from '@/hooks/use-me'
import { editUser } from '@/restapi/users/mutation'

import { editProfileSchema } from './profile.schema'

export const ProfileForm = () => {
  const { me, isLoading } = useMe()
  const [showChangePasswordModal, setChangePasswordModal] = useState(false)
  const onSubmit = async (values: Record<string, any>) => {
    // wait user to be ready
    if (!me?._id) {
      return
    }

    // revalidate confirm password
    // if (values?.password && values?.password !== values?.confirmPassword) {
    //   toast.error('Password and confirm password does not match.')
    //   return
    // }
    // update profile
    await editUser(me?._id, {
      email: values?.email
    })
  }

  const values = useMemo(() => {
    return {
      email: me?.email || ''
    }
  }, [me])

  if (isLoading) {
    return (
      <div className="min-h-8rem flex justify-center items-center">
        <Loading />
      </div>
    )
  }
  return (
    <div>
      <Formik initialValues={values} validationSchema={editProfileSchema} onSubmit={onSubmit} enableReinitialize>
        {({ values, handleChange, handleBlur, handleSubmit, errors, isSubmitting }) => (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-3 lg:space-y-3">
            <Input
              label="Email"
              placeholder="john.doe@gmail.com"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.email}
              error={errors?.email}
              hint="You can't change your email address at the moment."
              disabled
            />
            <div className="flex space-x-3 items-center">
              <Button type="submit" variant="primary" loading={isSubmitting}>
                Save
              </Button>
              <Button type="button" variant="outline" className="space-x-2" onClick={() => setChangePasswordModal(true)}>
                <MdEdit />
                <span>{me?.noPassword ? 'Create Password' : 'Change Password'}</span>
              </Button>
            </div>
          </form>
        )}
      </Formik>
      <ChangePasswordModal show={showChangePasswordModal} onClose={() => setChangePasswordModal(false)} />
    </div>
  )
}
