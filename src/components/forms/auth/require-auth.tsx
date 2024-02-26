import { Formik } from 'formik'
import moment from 'moment'
import { useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui'
import { Input } from '@/components/ui/forms'
import { useMe } from '@/hooks/use-me'
import { usePrivateRss } from '@/hooks/use-private-rss'
import { User } from '@/restapi/users/user'
import api from '@/services/api'

import { requireAuthSchema } from './auth.schema'

interface RequireAuthFormProps {
  onSuccess?: (data: User.Entity) => void
  onCancel?: () => void
}
export const RequireAuthForm: React.FC<RequireAuthFormProps> = ({ onSuccess, onCancel }) => {
  const { me } = useMe()
  const { setAuthCookie } = usePrivateRss()
  const onSubmit = async (values: Record<string, any>) => {
    if (!me?.nftId) return
    try {
      const basicAuth = btoa(`${me?.nftId}:${values.password}:${moment().unix()}`)
      const validateBasicAuth = await api
        .get('/auth/validate-basic-auth', {
          headers: {
            'x-authorize-token': basicAuth
          }
        })
        .then(({ data }) => data)
      if (!validateBasicAuth?.data) {
        toast.error('Invalid password.')
        return
      }
      setAuthCookie(me?.nftId, values.password)
      // async wait for 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSuccess?.(me)
    } catch (error: any) {
      toast.error('Invalid password.')
    }
  }

  const values = useMemo(() => {
    return {
      password: ''
    }
  }, [])

  useEffect(() => {
    if (me?.noPassword) {
      toast.error('You need to add password in order to access this resources.', {
        id: 'no-password'
      })
    }
  }, [me?.noPassword])

  return (
    <Formik initialValues={values} validationSchema={requireAuthSchema} onSubmit={onSubmit} enableReinitialize>
      {({ values, handleChange, handleBlur, handleSubmit, errors, isSubmitting }) => (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3 lg:space-y-3">
          <div className="mb-3">
            <h1 className="text-xl font-semibold">Authentication Required</h1>
            <span className="text-gray-300">To access certain parts of the Dashboard, please confirm your password.</span>
          </div>

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            name="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values?.password}
            error={errors?.password}
          />
          <Button type="submit" variant="primary" loading={isSubmitting}>
            Continue
          </Button>
          <Button type="button" variant="none" className="hover:underline hover:opacity-80" onClick={onCancel}>
            Cancel
          </Button>
        </form>
      )}
    </Formik>
  )
}
