import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { GET_MY_PERMISSIONS } from '@/restapi/users/constants'
import api from '@/services/api'

import { verifyPermissions } from './verify-permissions'

interface VerifyPagePermissionsProps {
  jwt?: string
}
export const verifyPagePermissions = async (opts?: VerifyPagePermissionsProps) => {
  'use server'
  // get user permissions detail from api
  const permissions = await api
    .get(GET_MY_PERMISSIONS, {
      headers: {
        Authorization: `Bearer ${opts?.jwt}`
      }
    })
    .then(({ data }) => data?.data)
    .catch(() => null)
  const headersList = headers()
  // read the custom x-pathname header
  // we define this header in the middleware.ts file
  const pathname = headersList.get('x-pathname') || ''

  // verify if user has permission to this page
  const hasPermission = verifyPermissions(pathname, permissions, true)

  if (!hasPermission) {
    redirect(`/error/403`)
  }
  return permissions
}
