import { getServerSession } from 'next-auth'

import { Sidebar } from '@/components/common'
import { Navbar } from '@/components/common/navbar'
import { ClientProvider } from '@/components/providers/client'
import { verifyPagePermissions } from '@/lib/verify-page-access'
// import api from '@/services/api'
import { authOptions } from '@/services/auth'

const RootLayout = async (props: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions)

  const permissions = await verifyPagePermissions({
    jwt: session?.jwt
  })
  return (
    <ClientProvider jwt={session?.jwt}>
      <div className="flex lg:ml-240px">
        <Sidebar permissions={permissions} />
        <Navbar />
        <div className="mt-20 px-6 w-full">{props.children}</div>
      </div>
    </ClientProvider>
  )
}

export default RootLayout
