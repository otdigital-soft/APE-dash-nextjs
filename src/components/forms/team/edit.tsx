import { Formik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui'
import { Input, Select } from '@/components/ui/forms'
import { ItemOption } from '@/components/ui/forms/select'
import { permissionOptions } from '@/constants/app'
import { editTeamMember } from '@/restapi/teams/mutation'
import { Team } from '@/restapi/teams/team'
import { User } from '@/restapi/users/user'

import { editTeamSchema } from './team.schema'

interface EditTeamMemberFormProps {
  onSuccess?: (data: User.Entity) => void
  data?: User.Entity
}
export const EditTeamMemberForm: React.FC<EditTeamMemberFormProps> = ({ onSuccess, data }) => {
  const [permissions, setPermissions] = useState<typeof permissionOptions | []>(permissionOptions)
  const [selectedPermissions, setSelectedPermissions] = useState<ItemOption[]>()

  const onSubmit = async (values: Record<string, any>) => {
    try {
      // wait user to be ready
      if (!data?._id) {
        return
      }
      const selectedPermissionValues = selectedPermissions?.map((item) => item.value as string)?.filter(Boolean)
      if (!selectedPermissionValues?.length) {
        toast.error('Please select at least one permission.')
        return
      }
      const body: Team.EditTeamMemberDto = {
        name: values?.name,
        permissions: selectedPermissionValues
      }
      if (values?.newPassword) {
        body.newPassword = values?.newPassword
      }
      // update profile
      const action = await editTeamMember(data?._id, body)
      if (action?.data?._id) {
        toast.success('Member detail updated successfully.')
        onSuccess?.(action?.data)
      }
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong, please try again later.')
    }
  }

  const values = useMemo(() => {
    return {
      name: data?.name || '',
      email: data?.email || '',
      newPassword: ''
    }
  }, [data])

  useEffect(() => {
    // if there is all permissions selected, then remove all permission options
    const hasAllPermission = selectedPermissions?.find((item) => item.value === 'all')
    if (hasAllPermission) {
      setPermissions([])
    } else {
      setPermissions(permissionOptions)
    }
  }, [selectedPermissions])

  useEffect(() => {
    // if there is permissions from database, then we need to filter it from const and set it to selected permissions
    const defaultPermissions = permissionOptions.filter((item) => data?.permissions?.includes(item.value))
    if (defaultPermissions?.length) {
      setSelectedPermissions(defaultPermissions)
    }
  }, [data])

  return (
    <Formik initialValues={values} validationSchema={editTeamSchema} onSubmit={onSubmit} enableReinitialize>
      {({ values, handleChange, handleBlur, handleSubmit, errors, isSubmitting }) => (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3 lg:space-y-3">
          <h1 className="text-xl font-semibold mb-3">Edit Team Member</h1>
          <div className="grid lg:grid-cols-2 lg:gap-x-3">
            <Input
              label="Email"
              type="email"
              placeholder="Enter team member email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.email}
              error={errors?.email}
              hint="Email can't be changed at the moment."
              disabled
            />

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
          <Input
            label="New Password"
            type="password"
            placeholder="Enter your new password"
            name="newPassword"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values?.newPassword}
            error={errors?.newPassword}
            hint="Leave blank if you don't want to change password."
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
