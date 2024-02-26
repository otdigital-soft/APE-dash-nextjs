'use client'
import { Formik } from 'formik'
import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import useSWR from 'swr'

import { socialOptions as options } from '@/constants/app'
import { social } from '@/lib/utils'
import { GET_ALL_ACCOUNT } from '@/restapi/accounts/constants'
import { createAccount } from '@/restapi/accounts/mutation'
import { addAccountSchema } from '@/restapi/accounts/schema'

import { AccessManagerTable } from '../common/datatable/access-manager'
import { Button } from '../ui'
import { Input, Select } from '../ui/forms'

const accountCreationInitial = {
  websiteKey: '',
  username: '',
  password: ''
}

export const SocialAccountSetup: React.FC = () => {
  const { mutate } = useSWR<RestApi.Response<Account.Account[]>>(GET_ALL_ACCOUNT)

  const [selectedSocial, setSelectedSocial] = useState<{
    label: string
    value: string
  }>()

  const handleAddAccount = async (values: typeof accountCreationInitial) => {
    if (socialOptions?.length === 0) {
      toast.error('No social media available to add account')
      return
    }
    const body = {
      ...values,
      websiteKey: social[selectedSocial?.value as 'instagram' | 'twitter'] || '',
      social: true
    }
    try {
      const account = await createAccount(body)
      if (account) {
        toast.success(account?.message || 'Account created successfully!')
        mutate()
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong. Please try again later.')
    }
  }

  const socialOptions = useMemo(() => {
    // const soc = accounts?.data?.map((account) => account.websiteKey)
    // const filtered = options.filter((option) => !soc?.includes((social as any)[option.value].toLowerCase()))
    // return filtered
    return options
  }, [])

  return (
    <div className="p-5 rounded-xl bg-dark-gray flex flex-col space-y-5">
      <h1 className="mb-4 font-bold">Add Social Media</h1>
      <Formik initialValues={accountCreationInitial} onSubmit={handleAddAccount} validationSchema={addAccountSchema}>
        {({ values, handleChange, handleBlur, handleSubmit, errors, isSubmitting }) => (
          <form onSubmit={handleSubmit} className="flex space-y-4 lg:space-x-5 items-end flex-col lg:flex-row">
            <div className="grid lg:grid-cols-3 lg:gap-x-5 lg:w-10/12 gap-y-3 lg:gap-y-0 w-full">
              <Select
                name="social"
                label="Select Social Media"
                options={socialOptions}
                size="sm"
                onChange={setSelectedSocial}
              />
              <Input
                name="username"
                label="Identifier (Email / Username)"
                size="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.username}
                error={errors?.username}
                disabled={socialOptions?.length === 0}
              />
              <Input
                name="password"
                label="Password"
                type="password"
                size="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.password}
                error={errors?.password}
                disabled={socialOptions?.length === 0}
              />
            </div>
            <Button type="submit" size="sm" className="lg:w-2/12 w-full py-3 lg:py-2" loading={isSubmitting}>
              Add
            </Button>
          </form>
        )}
      </Formik>
      <AccessManagerTable social showActions={false} />
    </div>
  )
}
