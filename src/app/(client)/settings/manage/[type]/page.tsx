'use client'

import { useParams, useRouter } from 'next/navigation'
import { MdAccountCircle } from 'react-icons/md'

import { ProfileForm } from '@/components/forms/profile/edit'
import { cn } from '@/lib/utils'

const availableConnetions = [
  {
    name: 'Profile',
    key: 'profile'
  }
]
export default function ConnectionPage() {
  const params = useParams()
  const { push } = useRouter()

  const handleConnectionChange = (key: string) => {
    push(`/settings/profile/${key}`)
  }
  return (
    <main className="flex flex-col space-y-3 my-5">
      <h1 className="text-2xl font-bold">Manage Account</h1>
      <div className="bg-dark-gray p-5 rounded-lg">
        {/* Tab */}
        <div className="flex space-x-3 border-b border-dark">
          {availableConnetions?.map((connection) => (
            <button
              key={connection.key}
              className={cn(
                'px-4 py-1 border-b-2 flex items-center space-x-2',
                params?.type === connection.key ? 'text-primary border-primary' : 'border-transparent'
              )}
              onClick={() => handleConnectionChange(connection.key)}>
              {connection.key === 'profile' && <MdAccountCircle />}
              <span>{connection.name}</span>
            </button>
          ))}
        </div>
        <div className="mt-5">{params?.type === 'profile' && <ProfileForm />}</div>
      </div>
    </main>
  )
}
