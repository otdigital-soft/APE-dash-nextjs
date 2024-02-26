import { Formik } from 'formik'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui'
import { Input } from '@/components/ui/forms'
import { useMe } from '@/hooks/use-me'
import { editUser } from '@/restapi/users/mutation'

export const DiscordConnect = () => {
  const { me, mutate } = useMe()
  const handleAddDiscordUsername = async (values: Record<string, any>) => {
    if (!me?._id) {
      toast.error('You need to login first')
      return
    }
    try {
      await editUser(me?._id, {
        discordUsername: values.discordUsername
      })
      mutate?.()
      toast.success('Discord username added successfully.')
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong, please try again later.')
    }
  }
  return (
    <Formik
      initialValues={{
        discordUsername: me?.discordUsername || ''
      }}
      onSubmit={handleAddDiscordUsername}
      enableReinitialize>
      {({ values, handleChange, handleBlur, handleSubmit, errors, isSubmitting }) => (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3 lg:space-y-3">
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
            </div>
          </div>
        </form>
      )}
    </Formik>
  )
}
