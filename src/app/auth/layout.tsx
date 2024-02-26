import { ClientProvider } from '@/components/providers/client'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProvider>
      <div className="px-6 w-full flex items-center justify-center h-screen text-center">{children}</div>
    </ClientProvider>
  )
}
