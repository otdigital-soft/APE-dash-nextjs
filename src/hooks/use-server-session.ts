import { getServerSession } from 'next-auth'

import api from '@/services/api'
import { authOptions } from '@/services/auth'

export const useServerSession = async () => {
  const session = await getServerSession(authOptions)
  if (session?.jwt) {
    api.defaults.headers.common['Authorization'] = `Bearer ${session?.jwt}`
  }
  return session
}
