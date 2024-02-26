import { Formik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui'
import { Input, Select } from '@/components/ui/forms'
import { ItemOption } from '@/components/ui/forms/select'
import { permissionOptions } from '@/constants/app'
import { useMe } from '@/hooks/use-me'
import { addTeamMember } from '@/restapi/teams/mutation'
import { User } from '@/restapi/users/user'

import { addTeamSchema } from './team.schema'

interface AddTeamMemberFormProps {
  onSuccess?: (data: User.Entity) => void
}
export const AddTeamMemberForm: React.FC<AddTeamMemberFormProps> = ({ onSuccess }) => {
  const { me } = useMe()
  const [permissions, setPermissions] = useState<typeof permissionOptions | []>(permissionOptions)
  const [selectedPermissions, setSelectedPermissions] = useState<ItemOption[]>()

  const onSubmit = async (values: Record<string, any>) => {
    try {
      // wait user to be ready
      if (!me?._id) {
        return
      }

      // check if user has selected permissions
      if (!selectedPermissions?.length) {
        toast.error('Please select at least one permission.')
        return
      }

      // revalidate confirm password
      if (values?.password && values?.password !== values?.confirmPassword) {
        toast.error('Password and confirm password does not match.')
        return
      }
      const selectedPermissionValues = selectedPermissions?.map((item) => item.value as string)?.filter(Boolean)
      // update profile
      const action = await addTeamMember({
        email: values?.email,
        name: values?.name,
        password: values?.password,
        permissions: selectedPermissionValues
      })
      if (action?.data?._id) {
        toast.success('Member added successfully.')
        onSuccess?.(action?.data)
      }
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong, please try again later.')
    }
  }

  const values = useMemo(() => {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  }, [])

  useEffect(() => {
    // if there is all permissions selected, then remove all permission options
    const hasAllPermission = selectedPermissions?.find((item) => item.value === 'all')
    if (hasAllPermission) {
      setPermissions([])
    } else {
      setPermissions(permissionOptions)
    }
  }, [selectedPermissions])
  return (
    <Formik initialValues={values} validationSchema={addTeamSchema} onSubmit={onSubmit} enableReinitialize>
      {({ values, handleChange, handleBlur, handleSubmit, errors, isSubmitting }) => (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3 lg:space-y-3">
          <h1 className="text-xl font-semibold mb-3">Add New Team Member</h1>

          <div className="grid lg:grid-cols-2 lg:gap-x-3">
            <Input
              label="Name"
              placeholder="Enter team member name"
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.name}
              error={errors?.name}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="Enter team member email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.email}
              error={errors?.email}
              required
            />
          </div>
          <div>
            <Select
              name="permissions"
              label="Select Permissions"
              options={permissions}
              size="sm"
              isMulti
              isSearchable
              value={selectedPermissions}
              onChange={(v: ItemOption[]) => {
                // if there is all permissions selected, then remove all permission options
                const hasAllPermission = v?.find((item) => item.value === 'all')
                if (hasAllPermission) {
                  setSelectedPermissions([
                    {
                      value: 'all',
                      label: 'All Permissions'
                    }
                  ])
                } else {
                  setSelectedPermissions(v)
                }
              }}
            />
          </div>
          <div className="grid lg:grid-cols-2 lg:gap-x-3">
            <Input
              label="New Password"
              type="password"
              placeholder="Enter your new password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.password}
              error={errors?.password}
              required
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
              required
            />
          </div>

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
