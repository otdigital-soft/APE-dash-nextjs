import { Formik } from 'formik'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { MdLogin } from 'react-icons/md'

import { Button } from '@/components/ui'
import { Input } from '@/components/ui/forms'

import { authSigninSchema } from './auth.schema'

const initialValues = {
  identifier: '',
  password: ''
}
export const AuthSigninForm = () => {
  const params = useSearchParams()

  const onSubmit = async (values: Record<string, any>) => {
    try {
      const sign = await signIn('credentials', {
        redirect: false,
        ...values
      })
      if (sign?.error) {
        toast.error('Email or password is incorrect.')
      } else {
        toast.success('Login successfully. Redirecting...')
        window.location.href = params.get('callbackUrl') || '/'
      }
    } catch (error: any) {
      toast.error(error.message || 'Email or password is incorrect.')
    }
  }
  return (
    <Formik initialValues={initialValues} validationSchema={authSigninSchema} onSubmit={onSubmit}>
      {({ values, handleChange, handleBlur, handleSubmit, errors, isSubmitting }) => (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3 lg:space-y-3">
          <Input
            label="Email"
            placeholder="john.doe@gmail.com"
            name="identifier"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values?.identifier}
            error={errors?.identifier}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            name="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values?.password}
            error={errors?.password}
            required
          />
          <Button type="submit" className="space-x-2" loading={isSubmitting}>
            {!isSubmitting && <MdLogin />}
            <span>Login</span>
          </Button>
        </form>
      )}
    </Formik>
  )
}
