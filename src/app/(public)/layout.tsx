import { PublicNavbar } from '@/components/common/navbar/public-navbar'
import { ClientProvider } from '@/components/providers/client'

// import api from '@/services/api'

const RootPublicLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <ClientProvider>
      <PublicNavbar />
      <div className="flex">
        <div className="mt-20 px-6 xl:max-w-80% w-full mx-auto">{children}</div>
      </div>
    </ClientProvider>
  )
}

export default RootPublicLayout
