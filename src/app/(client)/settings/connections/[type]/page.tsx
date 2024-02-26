'use client'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { BsDiscord, BsStripe } from 'react-icons/bs'

import { DiscordConnect } from '@/components/forms/connections/discord'
import { RingCentralConnect } from '@/components/forms/connections/ringcentral'
import { SocialConnectorConnect } from '@/components/forms/connections/social-connector'
import { StripeConnect } from '@/components/forms/connections/stripe'
import { cn } from '@/lib/utils'

const availableConnetions = [
  {
    name: 'Stripe',
    key: 'stripe'
  },
  {
    name: 'Discord',
    key: 'discord'
  },
  {
    name: 'Social Connector',
    key: 'social-connector'
  },
  {
    name: 'RingCentral',
    key: 'ringcentral'
  }
]
export default function ConnectionPage() {
  const params = useParams()
  const { push } = useRouter()

  const handleConnectionChange = (key: string) => {
    push(`/settings/connections/${key}`)
  }

  useEffect(() => {
    if (!params?.type || !availableConnetions.some((connection) => connection.key === params.type)) {
      push('/settings/connections/stripe')
    }
  }, [params, push])
  return (
    <main className="flex flex-col space-y-3 my-5">
      <h1 className="text-2xl font-bold">Third Party Connections</h1>
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
              {connection.key === 'stripe' && <BsStripe />}
              {connection.key === 'discord' && <BsDiscord />}
              {connection.key === 'social-connector' && (
                <Image
                  src={
                    params?.type === connection.key
                      ? '/static/icons/social-connector-colored.png'
                      : '/static/icons/social-connector-white.png'
                  }
                  alt="Social Connector"
                  width={16}
                  height={16}
                />
              )}
              {connection.key === 'ringcentral' && (
                <Image src="/static/icons/ringcentral.png" alt="Social Connector" width={16} height={16} />
              )}
              <span>{connection.name}</span>
            </button>
          ))}
        </div>
        <div className="mt-5">
          {params?.type === 'stripe' && <StripeConnect />}
          {params?.type === 'discord' && <DiscordConnect />}
          {params?.type === 'social-connector' && <SocialConnectorConnect />}
          {params?.type === 'ringcentral' && <RingCentralConnect />}
        </div>
      </div>
    </main>
  )
}
